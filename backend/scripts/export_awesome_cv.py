"""Export STI-Expert ExpertProfile data to posquit0/Awesome-CV LaTeX.

Usage inside Django container:
    python manage.py shell < backend/scripts/export_awesome_cv.py

Or import and call:
    from backend.scripts.export_awesome_cv import render_awesome_cv
    tex = render_awesome_cv(profile)

Notes:
- This is a mapping sample, not a full PDF pipeline.
- Copy Awesome-CV's `awesome-cv.cls` next to the generated .tex, then compile with xelatex.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any, Iterable

try:
    from apps.passport.models import ExpertProfile
except Exception:  # allows static inspection outside Django
    ExpertProfile = Any  # type: ignore


LATEX_SPECIALS = {
    "\\": r"\textbackslash{}",
    "&": r"\&",
    "%": r"\%",
    "$": r"\$",
    "#": r"\#",
    "_": r"\_",
    "{": r"\{",
    "}": r"\}",
    "~": r"\textasciitilde{}",
    "^": r"\textasciicircum{}",
}


def tex(value: Any) -> str:
    """Escape text for LaTeX."""
    if value is None:
        return ""
    s = str(value).strip()
    return "".join(LATEX_SPECIALS.get(ch, ch) for ch in s)


def split_name(full_name: str) -> tuple[str, str]:
    parts = (full_name or "Chuyên gia STI-Expert").strip().split()
    if len(parts) <= 1:
        return parts[0] if parts else "Chuyên gia", "STI-Expert"
    return " ".join(parts[:-1]), parts[-1]


def rows(qs_or_list: Any) -> list[Any]:
    if qs_or_list is None:
        return []
    if hasattr(qs_or_list, "all"):
        return list(qs_or_list.all())
    return list(qs_or_list)


def get(obj: Any, *names: str, default: str = "") -> str:
    for name in names:
        if isinstance(obj, dict):
            value = obj.get(name)
        else:
            value = getattr(obj, name, None)
        if value:
            return str(value)
    return default


def cventry(role: str, org: str, location: str, period: str, bullets: Iterable[str]) -> str:
    bullet_tex = "\n".join(f"        \\item {{{tex(b)}}}" for b in bullets if b)
    return f"""  \\cventry
    {{{tex(role)}}}
    {{{tex(org)}}}
    {{{tex(location)}}}
    {{{tex(period)}}}
    {{
      \\begin{{cvitems}}
{bullet_tex}
      \\end{{cvitems}}
    }}"""


def cvhonor(year: str, title: str, event: str, location: str = "") -> str:
    return f"  \\cvhonor{{{tex(title)}}}{{{tex(event)}}}{{{tex(location)}}}{{{tex(year)}}}"


def render_awesome_cv(profile: ExpertProfile) -> str:
    """Map Django ExpertProfile -> single Awesome-CV resume.tex string."""
    first, last = split_name(get(profile, "full_name"))
    title = get(profile, "title", "degree", default="Chuyên gia KHCN")
    summary = get(profile, "summary", "bio")

    email = get(profile, "email")
    phone = get(profile, "phone")
    address = get(profile, "address")
    website = get(profile, "website")
    linkedin = get(profile, "linkedin")
    github = ""

    # 1) Chuyên môn chính -> Awesome-CV skills section
    skill_lines = []
    for f in rows(getattr(profile, "fields", [])):
        name = get(f, "name", "field", "title")
        level = get(f, "level", "proficiency")
        yrs = get(f, "years_experience", "years", "experience_years")
        skill_lines.append(f"  \\cvskill{{{tex(name)}}}{{{tex(' · '.join(x for x in [level, yrs + ' năm' if yrs else ''] if x))}}}")

    # 2) Kinh nghiệm -> Awesome-CV experience entries
    experience_entries = []
    for exp in rows(getattr(profile, "experiences", [])):
        role = get(exp, "position", "title", "role")
        org = get(exp, "company", "organization", "org")
        period = get(exp, "period", "duration", "start_year")
        desc = get(exp, "description", "desc", "summary")
        experience_entries.append(cventry(role, org, "", period, [desc] if desc else []))

    # 3) Học vấn -> education entries
    education_entries = []
    for edu in rows(getattr(profile, "education", [])):
        degree = get(edu, "degree", "title")
        school = get(edu, "institution", "school", "organization")
        period = get(edu, "period", "year", "graduated_year")
        major = get(edu, "major", "field")
        education_entries.append(cventry(degree, school, "", period, [major] if major else []))

    # 4) Publications / research results -> honors-like compact list
    publication_lines = []
    for p in rows(getattr(profile, "papers", [])):
        publication_lines.append(cvhonor(get(p, "year"), get(p, "title"), get(p, "journal", "source", "publisher")))
    for r in rows(getattr(profile, "research_results", [])):
        publication_lines.append(cvhonor(get(r, "year"), get(r, "title", "name"), get(r, "organization", "source")))

    # 5) Awards, certificates, patents -> honors
    honor_lines = []
    for a in rows(getattr(profile, "awards", [])):
        honor_lines.append(cvhonor(get(a, "earn_date", "year"), get(a, "name", "title"), get(a, "org", "organization")))
    for c in rows(getattr(profile, "certificates", [])):
        honor_lines.append(cvhonor(get(c, "issue_date", "year"), get(c, "name", "title"), get(c, "issuing_organization", "organization")))
    for p in rows(getattr(profile, "patents", [])):
        honor_lines.append(cvhonor(get(p, "year", "issue_date"), get(p, "title", "name"), get(p, "patent_number")))

    mobile_cmd = f"\\mobile{{{tex(phone)}}}" if phone else "% \\mobile{}"
    email_cmd = f"\\email{{{tex(email)}}}" if email else "% \\email{}"
    homepage_cmd = f"\\homepage{{{tex(website.replace('https://', '').replace('http://', ''))}}}" if website else "% \\homepage{}"
    linkedin_cmd = f"\\linkedin{{{tex(linkedin.rstrip('/').split('/')[-1])}}}" if linkedin else "% \\linkedin{}"
    github_cmd = f"\\github{{{tex(github)}}}" if github else "% \\github{}"

    # Header social commands: Awesome-CV supports these macros if class is present.
    header = f"""\\documentclass[11pt, a4paper]{{awesome-cv}}
\\geometry{{left=1.4cm, top=.8cm, right=1.4cm, bottom=1.8cm, footskip=.5cm}}
\\fontdir[fonts/]
\\colorlet{{awesome}}{{awesome-skyblue}}
\\setbool{{acvSectionColorHighlight}}{{true}}

\\name{{{tex(first)}}}{{{tex(last)}}}
\\position{{{tex(title)}}}
\\address{{{tex(address)}}}
{mobile_cmd}
{email_cmd}
{homepage_cmd}
{linkedin_cmd}
{github_cmd}

\\begin{{document}}
\\makecvheader[C]
"""

    sections = []
    if summary:
        sections.append(f"""\\cvsection{{Tóm tắt chuyên gia}}
\\begin{{cvparagraph}}
{tex(summary)}
\\end{{cvparagraph}}
""")

    if skill_lines:
        sections.append("\\cvsection{Chuyên môn chính}\n\\begin{cvskills}\n" + "\n".join(skill_lines) + "\n\\end{cvskills}\n")

    if experience_entries:
        sections.append("\\cvsection{Kinh nghiệm làm việc}\n\\begin{cventries}\n" + "\n".join(experience_entries) + "\n\\end{cventries}\n")

    if education_entries:
        sections.append("\\cvsection{Học vấn}\n\\begin{cventries}\n" + "\n".join(education_entries) + "\n\\end{cventries}\n")

    if publication_lines:
        sections.append("\\cvsection{Công bố / Kết quả nghiên cứu}\n\\begin{cvhonors}\n" + "\n".join(publication_lines) + "\n\\end{cvhonors}\n")

    if honor_lines:
        sections.append("\\cvsection{Chứng chỉ, giải thưởng, bằng sáng chế}\n\\begin{cvhonors}\n" + "\n".join(honor_lines) + "\n\\end{cvhonors}\n")

    return header + "\n".join(sections) + "\n\\end{document}\n"


def export_profile(profile_id: str, out_path: str = "/tmp/sti_expert_cv.tex") -> Path:
    profile = ExpertProfile.objects.get(id=profile_id)
    out = Path(out_path)
    out.write_text(render_awesome_cv(profile), encoding="utf-8")
    return out


if __name__ == "__main__":
    # Example: export first profile; adapt for management command/API endpoint later.
    profile = ExpertProfile.objects.first()
    if not profile:
        raise SystemExit("No ExpertProfile found")
    path = Path("/tmp/sti_expert_awesome_cv.tex")
    path.write_text(render_awesome_cv(profile), encoding="utf-8")
    print(path)
