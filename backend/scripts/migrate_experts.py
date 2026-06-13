#!/usr/bin/env python3
"""
Migrate expert profiles from Strapi V1 (manage.stiexpert.com) → V2 (v2.stiexpert.com).
Run: docker compose exec -T backend python scripts/migrate_experts.py

Strategy:
  1. For each Strapi expert with a unique email:
     - Create a User account (if not exists) with role=expert
     - Create/update ExpertProfile linked to that User
  2. Copy all nested data (experiences, certificates, education, etc.)
  3. Skip experts already migrated (idempotent)
"""
import json
import os
import sys

import django

# Setup Django inside the container
sys.path.insert(0, "/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")
django.setup()

from datetime import datetime
from apps.authentication.models import User
from apps.passport.models import (
    ExpertProfile, WorkExperience, Education, Certificate,
    Award, Patent, Paper, Project, ResearchResult,
    ScienceActivity, ProfessionalAssociation,
)


def parse_date(s):
    """Parse 'YYYY-MM-DD' or 'YYYY-MM' string to date or None."""
    if not s:
        return None
    try:
        for fmt in ("%Y-%m-%d", "%Y-%m"):
            try:
                return datetime.strptime(s[:10], fmt).date()
            except ValueError:
                continue
    except Exception:
        pass
    return None


def get_or_create_user(email, full_name, phone):
    """Get existing User or create new one with random password."""
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        pass

    username = email.split("@")[0][:150]
    base_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1

    user = User.objects.create(
        email=email,
        username=username,
        role=User.Role.EXPERT,
        phone=phone or "",
        is_active=True,
        first_name=full_name.split()[0] if full_name else "",
        last_name=" ".join(full_name.split()[1:]) if full_name and len(full_name.split()) > 1 else "",
    )
    # Set unusable password — user must reset via forgot-password flow
    user.set_unusable_password()
    user.save()
    return user


def map_gender(s):
    if not s:
        return ""
    s = s.lower().strip()
    if s in ("nam", "male", "m"):
        return "male"
    if s in ("nữ", "nu", "female", "f"):
        return "female"
    return "other"


def map_availability(s):
    if not s:
        return ExpertProfile.Availability.AVAILABLE
    s = s.lower()
    if s == "available":
        return ExpertProfile.Availability.AVAILABLE
    if s == "limited":
        return ExpertProfile.Availability.LIMITED
    return ExpertProfile.Availability.UNAVAILABLE


def migrate_one(raw):
    """Migrate a single Strapi expert record to V2. Returns (created_count, updated_count)."""
    email = raw.get("email", "").strip().lower()
    if not email:
        return 0, 0

    full_name = raw.get("full_name", "").strip()
    phone = raw.get("phone", "") or ""

    user = get_or_create_user(email, full_name, phone)

    profile, created = ExpertProfile.objects.get_or_create(
        user=user,
        defaults={
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "title": raw.get("title") or "",
            "bio": raw.get("summary") or "",
            "summary": raw.get("summary") or "",
            "main_field": raw.get("main_field") or "",
            "dob": parse_date(raw.get("dob")),
            "gender": map_gender(raw.get("gender")),
            "address": raw.get("address") or "",
            "identification_number": raw.get("identification_number") or "",
            "google_scholar": raw.get("google_scholar") or "",
            "facebook": raw.get("facebook") or "",
            "linkedin": raw.get("linkedin") or "",
            "hourly_rate": raw.get("hourlyRate") or "",
            "availability": map_availability(raw.get("availability")),
            "featured": bool(raw.get("featured")),
            "hide_info": bool(raw.get("hide_info")),
            "id_card_verify_waiting": bool(raw.get("id_card_verify_waiting")),
        },
    )

    # If profile already exists, do a light update
    updated = False
    if not created:
        # Update only top-level scalar fields (don't overwrite if blank in strapi)
        def upd(field, value):
            nonlocal updated
            if value and not getattr(profile, field, None):
                setattr(profile, field, value)
                updated = True

        upd("full_name", full_name)
        upd("title", raw.get("title"))
        upd("summary", raw.get("summary"))
        upd("main_field", raw.get("main_field"))

    if updated:
        profile.save()

    # ---- Experiences ----
    for xp in (raw.get("experiences") or []):
        position = xp.get("position") or xp.get("job_title") or xp.get("title") or ""
        if not position:
            continue
        WorkExperience.objects.get_or_create(
            expert=profile,
            position=position,
            company_name=xp.get("company_name") or "",
            start_date=parse_date(xp.get("start_date")),
            stop_date=parse_date(xp.get("stop_date")),
            description=xp.get("description") or "",
        )

    # ---- Education ----
    for ed in (raw.get("education") or []):
        school = ed.get("school_name") or ed.get("school") or ed.get("university") or ""
        degree = ed.get("degree") or ed.get("qualification") or ""
        if not school:  # Skip records with no school name
            continue
        Education.objects.get_or_create(
            expert=profile,
            school_name=school,
            degree=degree or "—",
            field_of_study=ed.get("field_of_study") or ed.get("major", ""),
            start_date=parse_date(ed.get("start_date")),
            end_date=parse_date(ed.get("end_date")),
            description=ed.get("description") or "",
        )

    # ---- Certificates ----
    for cert in (raw.get("certificates") or []):
        name = cert.get("name") or cert.get("certificate_name") or cert.get("title") or "Chứng chỉ"
        Certificate.objects.get_or_create(
            expert=profile,
            name=name,
            issuing_organization=cert.get("issuing_organization") or "",
            issue_date=parse_date(cert.get("issue_date", cert.get("date"))),
            expiration_date=parse_date(cert.get("expiration_date")),
            license_number=cert.get("license_number") or "",
        )

    # ---- Awards ----
    for aw in (raw.get("awards") or []):
        name = aw.get("name") or aw.get("award_name") or "Giải thưởng"
        Award.objects.get_or_create(
            expert=profile,
            name=name,
            org=aw.get("org") or aw.get("organization") or "",
            earn_date=parse_date(aw.get("earn_date") or aw.get("date")),
        )

    # ---- Patents ----
    for pat in (raw.get("patents") or []):
        num = pat.get("num") or pat.get("patent_number") or "Patent"
        Patent.objects.get_or_create(
            expert=profile,
            num=num,
            org=pat.get("org") or "—",
            earn_date=parse_date(pat.get("earn_date", pat.get("date"))),
        )

    # ---- Papers (from Paper component) ----
    for paper in (raw.get("Paper") or []):
        title = paper.get("title") or paper.get("name") or "Paper"
        Paper.objects.get_or_create(
            expert=profile,
            title=title,
            year=paper.get("year") or "",
            link=paper.get("link") or "",
            cited_by=paper.get("cited_by") or "",
            authors=paper.get("authors") or "",
            source=paper.get("source") or "strapi",
        )

    # ---- Projects ----
    for proj in (raw.get("projects") or []):
        role = proj.get("role") or proj.get("name") or "Thành viên"
        Project.objects.get_or_create(
            expert=profile,
            role=role,
            sponsor=proj.get("sponsor") or proj.get("company_name", ""),
            result=proj.get("result") or proj.get("description", ""),
        )

    # ---- Research Results ----
    for rr in (raw.get("research_results") or []):
        ResearchResult.objects.get_or_create(
            expert=profile,
            title=rr.get("title", "Kết quả nghiên cứu"),
            result=rr.get("result") or rr.get("description", ""),
        )

    # ---- Science Activities ----
    for sa in (raw.get("science_activities") or []):
        ScienceActivity.objects.get_or_create(
            expert=profile,
            description=sa.get("description") or sa.get("activity", ""),
        )

    # ---- Professional Associations ----
    for assoc in (raw.get("association") or []):
        name = assoc.get("name") if isinstance(assoc, dict) else str(assoc)
        if name:
            ProfessionalAssociation.objects.get_or_create(
                expert=profile,
                name=name,
            )

    return (1 if created else 0, 1 if not created else 0)


def main():
    # Disconnect signals to prevent welcome email storm during migration
    from django.db.models.signals import post_save
    from apps.authentication.signals import send_welcome_email_on_registration
    post_save.disconnect(send_welcome_email_on_registration, sender=User)

    json_path = "/app/data/strapi_experts.json"
    if not os.path.exists(json_path):
        print(f"ERROR: {json_path} not found. Run fetch_strapi.py first.")
        sys.exit(1)

    with open(json_path, encoding="utf-8") as f:
        experts = json.load(f)

    print(f"Loaded {len(experts)} Strapi records. Starting migration...")

    created = 0
    updated = 0
    skipped = 0
    errors = 0

    for i, raw in enumerate(experts):
        if (i + 1) % 200 == 0:
            print(f"  Progress: {i+1}/{len(experts)} ...")

        try:
            c, u = migrate_one(raw)
            created += c
            updated += u
        except Exception as e:
            print(f"  ERROR on record {i+1} ({raw.get('email', 'NO_EMAIL')}): {e}")
            errors += 1

    print()
    print("=" * 50)
    print(f"  Total Strapi records : {len(experts)}")
    print(f"  ✅ Created (new)     : {created}")
    print(f"  🔄 Updated (existing): {updated}")
    print(f"  ❌ Errors            : {errors}")
    print(f"  Users in V2 now      : {User.objects.count()}")
    print(f"  ExpertProfiles now    : {ExpertProfile.objects.count()}")
    print("=" * 50)


if __name__ == "__main__":
    main()