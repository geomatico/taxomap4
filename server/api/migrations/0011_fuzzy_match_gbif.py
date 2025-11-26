from django.db import migrations

from api.common.migrations import get_script_sql


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0010_rename_view'),
    ]

    operations = [
        migrations.RunSQL(get_script_sql('0011_fuzzy_match_gbif.sql'))
    ]
