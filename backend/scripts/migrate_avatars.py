#!/usr/bin/env python3
"""
Download avatar images from Strapi V1 media and save to local Django media root.
Run: docker compose exec -T backend python scripts/migrate_avatars.py
"""
import json
import os
import sys
import time
import hashlib

import django
sys.path.insert(0, "/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")
django.setup()

import requests
from django.conf import settings
from apps.authentication.models import User
from apps.passport.models import ExpertProfile

STRAPI_BASE = "https://manage.stiexpert.com"
BATCH_SIZE = 50


def download_image(url, timeout=15):
    """Download image bytes from URL."""
    try:
        r = requests.get(url, timeout=timeout, headers={
            "User-Agent": "STI-Expert-Migration/1.0"
        })
        if r.status_code == 200 and len(r.content) > 100:
            ct = r.headers.get("Content-Type", "image/jpeg")
            return r.content, ct
    except Exception as e:
        print(f"    Download error {url}: {e}")
    return None, None


def get_avatar_url(avatar_obj):
    """Extract full URL from Strapi media object."""
    if not avatar_obj:
        return None
    if isinstance(avatar_obj, dict):
        url = avatar_obj.get("url", "")
    else:
        url = str(avatar_obj)
    
    if url and not url.startswith("http"):
        url = STRAPI_BASE + url
    return url if url.startswith("http") else None


def main():
    print("=" * 60)
    print("  STI Expert — Avatar Migration (Local Storage)")
    print("=" * 60)

    json_path = "/app/data/strapi_experts.json"
    if not os.path.exists(json_path):
        print(f"ERROR: {json_path} not found")
        sys.exit(1)

    with open(json_path, encoding="utf-8") as f:
        experts = json.load(f)

    # Collect experts with avatar data
    to_migrate = []
    for e in experts:
        if e.get("avatar"):
            to_migrate.append(e)

    print(f"Strapi records with avatar: {len(to_migrate)}")

    if not to_migrate:
        print("No avatars to migrate.")
        return

    # Create local directory
    avatars_dir = os.path.join(settings.MEDIA_ROOT, "avatars")
    os.makedirs(avatars_dir, exist_ok=True)
    print(f"Local target directory: {avatars_dir}")

    updated = 0
    skipped = 0
    failed = 0

    for i, expert in enumerate(to_migrate):
        email = expert.get("email", "").strip().lower()
        if not email:
            skipped += 1
            continue

        avatar_obj = expert.get("avatar", {})
        url = get_avatar_url(avatar_obj)
        if not url:
            skipped += 1
            continue

        # Rate limit: sleep every BATCH_SIZE
        if i > 0 and i % BATCH_SIZE == 0:
            time.sleep(1)
            print(f"  ... {i}/{len(to_migrate)} processed")

        # Use hash of email for consistent filename
        ext = ".jpg"
        if isinstance(avatar_obj, dict):
            ext = avatar_obj.get("ext", ".jpg")
            if not ext.startswith("."):
                ext = "." + ext
        
        safe_name = hashlib.md5(email.encode()).hexdigest()[:12]
        filename = f"{safe_name}{ext}"
        local_path = os.path.join(avatars_dir, filename)

        # Check if user & profile exists in V2
        try:
            user = User.objects.get(email=email)
            profile = ExpertProfile.objects.get(user=user)
        except (User.DoesNotExist, ExpertProfile.DoesNotExist):
            skipped += 1
            continue

        # If file already exists, just update DB and skip download
        media_url = f"/media/avatars/{filename}"
        if os.path.exists(local_path) and os.path.getsize(local_path) > 100:
            profile.avatar = media_url
            profile.save(update_fields=["avatar"])
            updated += 1
            continue

        # Download
        img_bytes, ct = download_image(url)
        if not img_bytes:
            failed += 1
            continue

        with open(local_path, "wb") as f:
            f.write(img_bytes)

        # Save DB
        profile.avatar = media_url
        profile.save(update_fields=["avatar"])
        updated += 1

        if updated % 10 == 0:
            print(f"  ✅ Migrated {updated} avatars...")

    print()
    print("=" * 60)
    print(f"  Total with avatar  : {len(to_migrate)}")
    print(f"  ✅ Updated         : {updated}")
    print(f"  ⏭ Skipped         : {skipped}")
    print(f"  ❌ Failed          : {failed}")
    print("=" * 60)


if __name__ == "__main__":
    main()