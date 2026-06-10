import csv
from apps.passport.models import ExpertProfile
from apps.passport.management.commands.import_legacy_experts import extract_real_image_url, download_image

CSV_PATH = '/app/data/user_import_experts.csv'
AVATAR_DIR = 'expert_avatars/legacy'

updated = 0
created = 0
avatars = 0
skipped = 0

with open(CSV_PATH, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        name = (row.get('name') or '').strip()
        if not name:
            skipped += 1
            continue

        position = (row.get('position') or '').strip()
        workplace = (row.get('workplace') or '').strip()
        intro = (row.get('personal_introduction') or '').strip()
        research_area = (row.get('research_area') or '').strip()
        facebook = (row.get('facebook') or '').strip()
        linkedin = (row.get('linkedin') or '').strip()
        website = (row.get('website') or '').strip()
        profile_link = (row.get('profile_link') or '').strip()
        image_url = (row.get('image_url') or '').strip()
        fields_list = [x.strip() for x in research_area.split(',') if x.strip()]

        expert = ExpertProfile.objects.filter(full_name__iexact=name).first()
        if expert:
            updated += 1
        else:
            skipped += 1
            continue

        expert.title = (position or expert.title or '')[:255]
        expert.organization = (workplace or expert.organization or '')[:255]
        expert.bio = intro or expert.bio or ''
        expert.summary = (intro or expert.summary or '')[:500]
        expert.fields = fields_list or expert.fields or []
        if facebook.startswith('http'):
            expert.facebook = facebook[:500]
        if linkedin.startswith('http'):
            expert.linkedin = linkedin[:500]
        if website.startswith('http'):
            expert.website = website[:500]
        if 'scholar.google' in profile_link:
            expert.google_scholar = profile_link[:500]
        expert.is_public = True
        expert.save()

        real_url = extract_real_image_url(image_url)
        if real_url:
            safe_name = expert.full_name.encode('ascii', 'ignore').decode() or 'expert'
            safe_name = ''.join(ch if ch.isalnum() else '_' for ch in safe_name)[:40]
            content = download_image(real_url, f'{safe_name}.jpg')
            if content:
                expert.avatar.save(f'{AVATAR_DIR}/{safe_name}.jpg', content, save=True)
                avatars += 1

print({
    'updated': updated,
    'created': created,
    'avatars_downloaded': avatars,
    'skipped': skipped,
    'total_experts': ExpertProfile.objects.count(),
    'experts_with_avatar': ExpertProfile.objects.exclude(avatar='').exclude(avatar__isnull=True).count(),
})
