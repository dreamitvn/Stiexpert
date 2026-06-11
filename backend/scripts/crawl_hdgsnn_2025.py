"""Crawl HDGSNN 2025 GS/PGS candidates → STI-Expert DB.

Uses only stdlib (urllib) + PyMuPDF (fitz) — no requests/bs4 needed.

Run inside backend container:
  LIMIT=5 DRY_RUN=1 USE_LLM=0 python manage.py shell < scripts/crawl_hdgsnn_2025.py
  LIMIT=5 NINTH_ROUTER_API_KEY=sk-xxx python manage.py shell < scripts/crawl_hdgsnn_2025.py
  NINTH_ROUTER_API_KEY=sk-xxx python manage.py shell < scripts/crawl_hdgsnn_2025.py
"""
from __future__ import annotations

import hashlib
import html
import json
import os
import re
import ssl
import time
import unicodedata
import urllib.request
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.db import transaction

from apps.passport.models import (
    Award, Certificate, Education, ExpertProfile,
    Paper, Patent, Project, ResearchResult, WorkExperience,
)

# ── Config ──────────────────────────────────────────────
SOURCE_URL = (
    "http://hdgsnn.gov.vn/tin-tuc/"
    "danh-sach-ung-vien-duoc-hdgscs-de-nghi-xet-cong-nhan-"
    "dat-tieu-chuan-chuc-danh-gs-pgs-nam-2025_819"
)
BASE_DIR = Path(os.getenv("HDGSNN_WORKDIR", "/app/data/hdgsnn_2025"))
PDF_DIR = BASE_DIR / "pdfs"
TEXT_DIR = BASE_DIR / "texts"
IMG_DIR = BASE_DIR / "portraits"
for d in [PDF_DIR, TEXT_DIR, IMG_DIR]:
    d.mkdir(parents=True, exist_ok=True)

LIMIT = int(os.getenv("LIMIT", "0") or "0")
DRY_RUN = os.getenv("DRY_RUN", "0") == "1"
USE_LLM = os.getenv("USE_LLM", "1") != "0"
ROUTER_BASE = os.getenv("NINTH_ROUTER_BASE_URL",
                         "http://9router.hoangcd.com:20128/v1").rstrip("/")
ROUTER_KEY = os.getenv("NINTH_ROUTER_API_KEY", "")
ROUTER_MODEL = os.getenv("NINTH_ROUTER_MODEL", "stiexperts")

UA = "Mozilla/5.0 STI-Expert-Crawler/2.0"
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE


# ── Helpers ─────────────────────────────────────────────
def fetch(url: str, binary: bool = False) -> str | bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120, context=CTX) as resp:
        data = resp.read()
    return data if binary else data.decode("utf-8", errors="replace")


def strip_tags(s: str) -> str:
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def slugify(s: str) -> str:
    s = (s or "expert").replace("Đ", "D").replace("đ", "d")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower() or "expert"


def normalize_date(d: str) -> str | None:
    d = (d or "").strip()
    for pat, order in [
        (r"(\d{1,2})/(\d{1,2})/(\d{4})", "dmy"),
        (r"(\d{4})-(\d{1,2})-(\d{1,2})", "ymd"),
    ]:
        m = re.search(pat, d)
        if m:
            if order == "dmy":
                day, month, year = m.groups()
            else:
                year, month, day = m.groups()
            return f"{int(year):04d}-{int(month):02d}-{int(day):02d}"
    return None


def sti_id(name: str, dob: str, field: str) -> str:
    raw = f"HDGSNN-2025|{name}|{dob}|{field}"
    return "STI-" + hashlib.sha1(raw.encode()).hexdigest()[:12].upper()


# ── 1. Parse HTML table ────────────────────────────────
@dataclass
class CandidateRow:
    idx: int
    full_name: str
    dob: str
    gender: str
    field: str
    workplace: str
    title: str
    pdf_url: str


def parse_table() -> list[CandidateRow]:
    page_html = fetch(SOURCE_URL)
    table_m = re.search(r"<table[^>]*>(.*?)</table>", page_html, re.I | re.S)
    if not table_m:
        raise RuntimeError("No table found on page")
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table_m.group(1), re.I | re.S)
    candidates: list[CandidateRow] = []
    for tr in rows:
        cells = re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.I | re.S)
        if len(cells) < 7:
            continue
        plain = [strip_tags(c) for c in cells]
        if "Họ" in plain[1] or "Ngày" in " ".join(plain[:3]):
            continue
        pdf_m = re.search(r'href=["\']([^"\']+\.pdf[^"\']*)["\']', tr, re.I)
        if not pdf_m:
            continue
        try:
            idx = int(re.sub(r"\D+", "", plain[0]) or len(candidates) + 1)
        except Exception:
            idx = len(candidates) + 1
        candidates.append(CandidateRow(
            idx=idx,
            full_name=plain[1],
            dob=plain[2],
            gender=plain[3],
            field=plain[4],
            workplace=plain[5],
            title=plain[6],
            pdf_url=html.unescape(pdf_m.group(1)),
        ))
    return candidates


# ── 2. Download PDF ────────────────────────────────────
def download_pdf(row: CandidateRow) -> Path:
    name = f"{row.idx:03d}-{slugify(row.full_name)}.pdf"
    path = PDF_DIR / name
    if path.exists() and path.stat().st_size > 1024:
        return path
    data = fetch(row.pdf_url, binary=True)
    path.write_bytes(data)
    return path


# ── 3. Extract text + portrait ─────────────────────────
def extract_pdf(pdf_path: Path) -> tuple[str, Path | None]:
    doc = fitz.open(str(pdf_path))
    texts = [page.get_text("text") for page in doc]
    full_text = "\n".join(texts).strip()
    (TEXT_DIR / f"{pdf_path.stem}.txt").write_text(full_text, encoding="utf-8")

    portrait_path = None
    if doc.page_count:
        page = doc[0]
        best = None
        for img_i, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            try:
                pix = fitz.Pixmap(doc, xref)
                if pix.n >= 5:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                w, h = pix.width, pix.height
                area = w * h
                ratio = h / max(w, 1)
                # Portrait heuristic: tall-ish image, not tiny
                score = area + (50000 if 0.8 <= ratio <= 2.2 else 0)
                if area > 10000 and (best is None or score > best[0]):
                    out = IMG_DIR / f"{pdf_path.stem}-portrait.png"
                    pix.save(str(out))
                    best = (score, out)
            except Exception:
                continue
        if best:
            portrait_path = best[1]
    doc.close()
    return full_text, portrait_path


# ── 4. LLM parse (9Router) ────────────────────────────
def llm_parse(row: CandidateRow, text: str) -> dict[str, Any]:
    if not USE_LLM or not ROUTER_KEY:
        return {}
    prompt = f"""Bạn là module extraction STI-Expert. Trích xuất CV ứng viên GS/PGS thành JSON.
Chỉ trả JSON thuần, KHÔNG markdown.

Dữ liệu bảng:
{json.dumps(asdict(row), ensure_ascii=False)}

Nội dung PDF (cắt nếu quá dài):
{text[:40000]}

Schema JSON cần điền:
{{
  "summary": "tóm tắt 2-3 câu",
  "degree": "học vị cao nhất",
  "main_field": "ngành chính",
  "education": [{{"school_name":"", "degree":"", "field_of_study":"", "start_date":"", "end_date":"", "description":""}}],
  "experiences": [{{"position":"", "company_name":"", "start_date":"", "stop_date":"", "description":""}}],
  "certificates": [{{"name":"", "issuing_organization":"", "issue_date":"", "license_number":""}}],
  "awards": [{{"name":"", "org":"", "earn_date":""}}],
  "projects": [{{"name":"", "role":"", "sponsor":"", "result":""}}],
  "patents": [{{"title":"", "num":"", "org":"", "earn_date":""}}],
  "papers": [{{"title":"", "year":"", "journal":"", "link":"", "authors":"", "cited_by":""}}],
  "research_results": [{{"title":"", "result":""}}]
}}"""
    body = json.dumps({
        "model": ROUTER_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
    }).encode()
    req = urllib.request.Request(
        f"{ROUTER_BASE}/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {ROUTER_KEY}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=180, context=CTX) as resp:
        result = json.loads(resp.read())
    content = result["choices"][0]["message"]["content"]
    content = re.sub(r"^```json\s*|\s*```$", "", content.strip(), flags=re.I | re.S)
    try:
        return json.loads(content)
    except Exception:
        (BASE_DIR / f"llm-bad-{row.idx:03d}.txt").write_text(content, encoding="utf-8")
        return {}


# ── 5. Upsert to DB ───────────────────────────────────
def safe_date(v):
    if not v:
        return None
    return normalize_date(str(v))


def upsert_related(expert: ExpertProfile, data: dict[str, Any]) -> None:
    if not expert.education.exists():
        for e in data.get("education", [])[:20]:
            Education.objects.create(
                expert=expert,
                school_name=(e.get("school_name") or "")[:255],
                degree=(e.get("degree") or "")[:255],
                field_of_study=(e.get("field_of_study") or "")[:255],
                start_date=safe_date(e.get("start_date")),
                end_date=safe_date(e.get("end_date")),
                description=e.get("description") or "",
            )
    if not expert.experiences.exists():
        for e in data.get("experiences", [])[:30]:
            WorkExperience.objects.create(
                expert=expert,
                position=(e.get("position") or "")[:255],
                company_name=(e.get("company_name") or "")[:255],
                start_date=safe_date(e.get("start_date")),
                stop_date=safe_date(e.get("stop_date")),
                description=e.get("description") or "",
            )
    if not expert.certificates.exists():
        for c in data.get("certificates", [])[:30]:
            Certificate.objects.create(
                expert=expert,
                name=(c.get("name") or "")[:255],
                issuing_organization=(c.get("issuing_organization") or "")[:255],
                issue_date=safe_date(c.get("issue_date")),
                license_number=(c.get("license_number") or "")[:255],
            )
    if not expert.awards.exists():
        for a in data.get("awards", [])[:30]:
            Award.objects.create(
                expert=expert,
                name=(a.get("name") or "")[:255],
                org=(a.get("org") or a.get("issuing_organization") or "")[:255],
                earn_date=safe_date(a.get("earn_date") or a.get("award_date")),
            )
    if not expert.patents.exists():
        for p in data.get("patents", [])[:30]:
            Patent.objects.create(
                expert=expert,
                num=(p.get("num") or p.get("patent_number") or "")[:100],
                org=(p.get("org") or "")[:255],
                earn_date=safe_date(p.get("earn_date") or p.get("issue_date")),
            )
    if not expert.papers.exists():
        for p in data.get("papers", [])[:200]:
            Paper.objects.create(
                expert=expert,
                title=(p.get("title") or "")[:500],
                year=str(p.get("year") or "")[:10],
                link=(p.get("link") or p.get("doi") or "")[:200],
                cited_by=str(p.get("cited_by") or "")[:50],
                authors=(p.get("authors") or "")[:500],
                source="hdgsnn_2025",
            )
    if not expert.projects.exists():
        for p in data.get("projects", [])[:50]:
            Project.objects.create(
                expert=expert,
                role=(p.get("role") or p.get("name") or "")[:255],
                sponsor=(p.get("sponsor") or "")[:255],
                result=p.get("result") or p.get("description") or "",
            )
    if not expert.research_results.exists():
        for rr in data.get("research_results", [])[:50]:
            ResearchResult.objects.create(
                expert=expert,
                title=(rr.get("title") or "")[:255],
                result=rr.get("result") or rr.get("description") or "",
            )


def upsert_candidate(
    row: CandidateRow,
    text: str,
    portrait: Path | None,
    parsed: dict[str, Any],
) -> ExpertProfile:
    User = get_user_model()
    dob = normalize_date(row.dob)
    gender = {"Nam": "male", "Nữ": "female"}.get(row.gender, "")
    sid = sti_id(row.full_name, row.dob, row.field)

    with transaction.atomic():
        expert = ExpertProfile.objects.filter(sti_id=sid).first()
        if not expert and dob:
            expert = ExpertProfile.objects.filter(
                full_name__iexact=row.full_name, dob=dob
            ).first()
        if not expert:
            email = f"hdgsnn-{sid.lower()}@stiexpert.local"
            user, _ = User.objects.get_or_create(
                email=email,
                defaults={"role": "expert", "full_name": row.full_name},
            )
            expert, _ = ExpertProfile.objects.get_or_create(
                user=user, defaults={"full_name": row.full_name}
            )

        expert.sti_id = expert.sti_id or sid
        expert.full_name = row.full_name
        expert.dob = dob or expert.dob
        expert.gender = gender or expert.gender
        expert.main_field = (
            parsed.get("main_field") or row.field or expert.main_field
        )[:255]
        expert.fields = parsed.get("fields") or (
            [{"name": row.field, "level": row.title}] if row.field else expert.fields
        )
        expert.organization = (row.workplace or expert.organization)[:255]
        expert.title = (row.title or expert.title)[:255]
        expert.degree = (
            parsed.get("degree") or expert.degree or row.title
        )[:100]
        expert.summary = (
            parsed.get("summary")
            or f"Ứng viên {row.title} ngành {row.field}, {row.workplace}."
        )[:1000]
        expert.bio = text[:8000] if text else expert.bio
        expert.nationality = expert.nationality or "Việt Nam"
        expert.professional_verification_status = (
            ExpertProfile.VerificationStatus.PENDING
        )
        expert.is_public = True
        expert.save()

        if portrait and portrait.exists() and not expert.avatar:
            expert.avatar.save(
                f"profiles/hdgsnn_2025/{portrait.name}",
                ContentFile(portrait.read_bytes()),
                save=True,
            )

        upsert_related(expert, parsed)
        return expert


# ── 6. Main ────────────────────────────────────────────
def main() -> None:
    print(f"=== HDGSNN 2025 Crawler ===")
    print(f"DRY_RUN={DRY_RUN} USE_LLM={USE_LLM} LIMIT={LIMIT}")
    print(f"LLM: {ROUTER_MODEL}@{ROUTER_BASE} key={'yes' if ROUTER_KEY else 'NO'}")

    rows = parse_table()
    print(f"Parsed {len(rows)} candidates from table")
    if LIMIT:
        rows = rows[:LIMIT]

    stats = {
        "total_rows": len(rows),
        "created_or_updated": 0,
        "pdfs": 0,
        "portraits": 0,
        "llm_parsed": 0,
        "errors": [],
    }

    for i, row in enumerate(rows):
        try:
            print(f"\n[{i+1}/{len(rows)}] #{row.idx} {row.full_name} | "
                  f"{row.field} | {row.title}")

            # Download PDF
            pdf = download_pdf(row)
            stats["pdfs"] += 1
            print(f"  PDF: {pdf.name} ({pdf.stat().st_size // 1024}KB)")

            # Extract text + portrait
            text, portrait = extract_pdf(pdf)
            print(f"  Text: {len(text)} chars | Portrait: {'YES' if portrait else 'no'}")
            if portrait:
                stats["portraits"] += 1

            # LLM parse
            parsed = {}
            if USE_LLM and ROUTER_KEY:
                try:
                    parsed = llm_parse(row, text)
                    if parsed:
                        stats["llm_parsed"] += 1
                        n_edu = len(parsed.get("education", []))
                        n_papers = len(parsed.get("papers", []))
                        n_awards = len(parsed.get("awards", []))
                        print(f"  LLM: edu={n_edu} papers={n_papers} awards={n_awards}")
                except Exception as e:
                    print(f"  LLM ERROR: {e}")

            # Upsert
            if not DRY_RUN:
                expert = upsert_candidate(row, text, portrait, parsed)
                stats["created_or_updated"] += 1
                avatar_info = expert.avatar.name if expert.avatar else "no-avatar"
                print(f"  -> {expert.sti_id} | avatar={avatar_info}")
            else:
                print(f"  -> DRY_RUN skip upsert")

            time.sleep(0.3)
        except Exception as e:
            stats["errors"].append({"idx": row.idx, "name": row.full_name, "error": str(e)})
            print(f"  ERROR: {e}")

    stats_path = BASE_DIR / "run_stats.json"
    stats_path.write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{'='*50}")
    print(json.dumps(stats, ensure_ascii=False, indent=2))


main()
