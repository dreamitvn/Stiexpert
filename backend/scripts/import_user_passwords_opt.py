#!/usr/bin/env python3
"""
Import user passwords from old CSV into V2 Django auth User table.
Optimized using fast dict lookup and single db query filter.
"""
import csv
import django, os, sys
sys.path.insert(0, "/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")
django.setup()

from apps.authentication.models import User
from django.contrib.auth.hashers import make_password

CSV_PATH = "/app/data/expert_new.csv"

def main():
    with open(CSV_PATH, encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"CSV rows: {len(rows)}")

    # Map email -> plain password
    csv_map = {}
    for r in rows:
        email = r.get("EMAIL", "").strip().lower()
        password = r.get("PASSWORD", "").strip()
        if email and password:
            csv_map[email] = password

    # Pull existing users in batch
    users = list(User.objects.filter(email__in=csv_map.keys()))
    print(f"Found {len(users)} users in V2 DB matching CSV.")

    updated = 0
    already_set = 0

    for user in users:
        pwd = csv_map[user.email]
        # Skip if already hashed properly
        if user.password and (user.password.startswith("pbkdf2_") or user.password.startswith("bcrypt_")):
            already_set += 1
            continue
        user.password = make_password(pwd)
        user.save(update_fields=["password"])
        updated += 1
        if updated % 100 == 0:
            print(f"  Processed {updated} user password hashes...")

    print(f"\n{'='*60}")
    print(f"  Updated      : {updated}")
    print(f"  Already OK   : {already_set}")
    print(f"  Total checked: {len(users)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()