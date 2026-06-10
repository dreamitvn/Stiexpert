from apps.passport.models import ExpertProfile

for idx, expert in enumerate(ExpertProfile.objects.order_by('created_at'), 1):
    changed = False
    if not expert.sti_id:
        expert.sti_id = f'STI-{idx:05d}'
        changed = True
    if not expert.main_field and expert.fields:
        expert.main_field = expert.fields[0]
        changed = True
    if not expert.summary and expert.bio:
        expert.summary = expert.bio[:500]
        changed = True
    if changed:
        expert.save(update_fields=['sti_id', 'main_field', 'summary'])

print({
    'total': ExpertProfile.objects.count(),
    'with_sti_id': ExpertProfile.objects.exclude(sti_id='').count(),
    'with_main_field': ExpertProfile.objects.exclude(main_field='').count(),
})
