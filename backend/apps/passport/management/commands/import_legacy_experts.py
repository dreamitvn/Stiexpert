"""
Management command to import legacy experts from GlobalVySa CSV (207 records).
Migrated schema from old Strapi production.
Downloads avatars directly from image_url (handles Next.js _next/image wrapped URLs).
Creates minimal User accounts (unusable password) for each expert.

Usage:
  docker exec sti-expert-backend-1 python manage.py import_legacy_experts
"""
import csv
import os
import re
import urllib.parse
import urllib.request
from io import BytesIO
from urllib.parse import urlparse, parse_qs

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.passport.models import ExpertProfile

User = get_user_model()

CSV_PATH = "/app/data/legacy_experts.csv"
AVATAR_DIR = "expert_avatars/legacy"


def extract_real_image_url(wrapped_url: str) -> str:
    """If the URL is a Next.js /_next/image?url=... wrapper, extract and unquote the real image URL."""
    if not wrapped_url:
        return ""
    if "/_next/image" in wrapped_url and "url=" in wrapped_url:
        try:
            parsed = urlparse(wrapped_url)
            qs = parse_qs(parsed.query)
            if "url" in qs and qs["url"]:
                real = urllib.parse.unquote(qs["url"][0])
                return real
        except Exception:
            pass
    return wrapped_url


def download_image(url: str, filename: str) -> ContentFile | None:
    """Download image from URL and return as ContentFile. Returns None on failure."""
    if not url or not url.startswith("http"):
        return None
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; STI-Expert-Importer/1.0)",
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Referer": "https://stiexpert.com/",
            },
        )
        with urllib.request.urlopen(req, timeout=20) as response:
            data = response.read()
            if len(data) < 2000:  # too small, probably error or placeholder
                return None
            # Guess extension
            content_type = response.headers.get("Content-Type", "")
            ext = ".jpg"
            if "png" in content_type:
                ext = ".png"
            elif "webp" in content_type:
                ext = ".webp"
            elif "jpeg" in content_type or "jpg" in content_type:
                ext = ".jpg"
            safe_filename = os.path.splitext(filename)[0] + ext
            return ContentFile(data, name=safe_filename)
    except Exception as e:
        # print(f"  [WARN] Failed to download {url}: {e}")
        return None


def parse_name(full_name: str) -> tuple[str, str]:
    """Split full_name into first/last for User if needed."""
    parts = full_name.strip().split()
    if len(parts) >= 2:
        return parts[0], " ".join(parts[1:])
    return full_name, ""


class Command(BaseCommand):
    help = "Import 207 legacy experts from GlobalVySa CSV with real avatars (from stiexpert.com production data)."

    def handle(self, *args, **options):
        if not os.path.exists(CSV_PATH):
            self.stdout.write(self.style.ERROR(f"CSV not found at {CSV_PATH}"))
            return

        self.stdout.write("Reading legacy_experts.csv (207 records)...")

        imported = 0
        skipped = 0
        avatars_downloaded = 0
        failed_avatars = 0

        with open(CSV_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader, 1):
                name = (row.get("name") or "").strip()
                if not name:
                    skipped += 1
                    continue

                # Skip if already imported (by full_name)
                if ExpertProfile.objects.filter(full_name__iexact=name).exists():
                    skipped += 1
                    continue

                # Create minimal User (unusable password)
                username_base = slugify(name)[:30] or f"expert-{imported}"
                username = username_base
                suffix = 1
                while User.objects.filter(username=username).exists():
                    username = f"{username_base}-{suffix}"
                    suffix += 1

                first_name, last_name = parse_name(name)
                user = User.objects.create_user(
                    username=username,
                    email=f"{username}@legacy.stiexpert.com",
                    first_name=first_name[:30],
                    last_name=last_name[:150],
                    is_active=True,
                )
                user.set_unusable_password()
                user.save()

                # Map fields
                position = (row.get("position") or "").strip()
                workplace = (row.get("workplace") or "").strip()
                intro = (row.get("personal_introduction") or "").strip()
                research_area = (row.get("research_area") or "").strip()

                fields_list = [x.strip() for x in research_area.split(",") if x.strip()]

                facebook = (row.get("facebook") or "").strip()
                linkedin = (row.get("linkedin") or "").strip()
                website = (row.get("website") or "").strip()
                profile_link = (row.get("profile_link") or "").strip()

                try:
                    expert = ExpertProfile.objects.create(
                        user=user,
                        full_name=name[:255],
                        email=user.email,
                        title=(position or "")[:255],
                        organization=(workplace or "")[:255],
                        bio=intro,
                        summary=(intro or "")[:500],
                        fields=fields_list,
                        facebook=facebook[:500] if facebook.startswith("http") else "",
                        linkedin=linkedin[:500] if linkedin.startswith("http") else "",
                        website=website[:500] if website.startswith("http") else "",
                        google_scholar=(profile_link or "")[:500] if "scholar.google" in profile_link else "",
                        is_public=True,
                        featured=False,
                        availability=ExpertProfile.Availability.AVAILABLE,
                    )

                    # Download avatar — try to get real image from wrapped URL
                    image_url = (row.get("image_url") or "").strip()
                    real_url = extract_real_image_url(image_url)
                    if real_url:
                        safe_name = re.sub(r"[^a-zA-Z0-9_-]", "_", slugify(name))[:40]
                        content = download_image(real_url, f"{safe_name}.jpg")
                        if content:
                            expert.avatar.save(
                                f"{AVATAR_DIR}/{safe_name}.jpg",
                                content,
                                save=True,
                            )
                            avatars_downloaded += 1
                        else:
                            failed_avatars += 1
                    else:
                        failed_avatars += 1

                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"  [ERROR] Failed to import {name}: {e}"))
                    # Clean up the user we created
                    user.delete()
                    skipped += 1
                    continue

                imported += 1
                if imported % 25 == 0:
                    self.stdout.write(f"  Imported {imported} experts... ({avatars_downloaded} avatars so far)")

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ Import complete.\n"
                f"   Experts imported: {imported}\n"
                f"   Skipped (duplicates/errors): {skipped}\n"
                f"   Avatars downloaded successfully: {avatars_downloaded}\n"
                f"   Avatars failed/missing: {failed_avatars}\n"
            )
        )
        self.stdout.write("You can now browse /admin/passport/expertprofile/ or the dashboard to see the data.")