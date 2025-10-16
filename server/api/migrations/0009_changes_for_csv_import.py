from django.db import migrations

from api.common.migrations import get_script_sql


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0008_cleanup'),
    ]

    operations = [
        migrations.RunSQL(get_script_sql('0009_insert_countries.sql')),
        migrations.RunSQL(get_script_sql('0009_insert_country_code_matching.sql')),
        migrations.RunSQL(get_script_sql('0009_changes_for_csv_import.sql'))
    ]
