from django.db import migrations

from api.common.migrations import get_script_sql


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(get_script_sql('0002_import_gbif.sql')),
        migrations.RunSQL(get_script_sql('0002_match_gbif.sql')),
    ]
