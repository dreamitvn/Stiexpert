#!/usr/bin/env python3
"""
Import user passwords from old CSV into V2 Django auth User table.
Run: docker compose exec -T backend python scripts/import_user_passwords.py
"""
import csv
import io
import hashlib
import re

import django, os, sys
sys.path.insert(0, "/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")
django.setup()

from apps.authentication.models import User
from django.contrib.auth.hashers import make_password

CSV_PATH = "/app/data/expert_new.csv"


def main():
    # Detect BOM encoding
    with open(CSV_PATH, "rb") as f:
        raw = f.read(4)
    encoding = "utf-8-sig" if raw[:3] == b"\xef\xbb\xbf" else "utf-8"

    with open(CSV_PATH, encoding=encoding, errors="replace") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"CSV rows: {len(rows)}")

    updated = 0
    not_found = 0
    already_set = 0
    errors = 0

    for row in rows:
        email = row.get("EMAIL", "").strip().lower()
        password = row.get("PASSWORD", "").strip()

        if not email or not password:
            continue

        try:
            user = User.objects.get(email=email)
            if user.password and len(user.password) > 50 and "$2b$" in user.password:
                # Already has bcrypt hash from Strapi migration
                already_set += 1
                continue
            if user.password == password:
                already_set += 1
                continue
            user.password = make_password(password)
            user.save(update_fields=["password"])
            updated += 1
        except User.DoesNotExist:
            not_found += 1
        except Exception as e:
            print(f"  ERROR {email}: {e}")
            errors += 1

    print(f"\n{'='*60}")
    print(f"  Updated      : {updated}")
    print(f"  Already ok   : {already_set}")
    print(f"  Not found    : {not_found}")
    print(f"  Errors       : {errors}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()