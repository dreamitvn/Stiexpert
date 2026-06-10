from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('passport', '0003_alter_expertprofile_facebook_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='expertprofile',
            name='researchgate',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
        migrations.AddField(
            model_name='expertprofile',
            name='sti_id',
            field=models.CharField(blank=True, db_index=True, default='', max_length=64),
        ),
        migrations.AddField(
            model_name='expertprofile',
            name='vneid_verified',
            field=models.BooleanField(default=False),
        ),
    ]
