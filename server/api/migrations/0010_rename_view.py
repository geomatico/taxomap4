from django.db import migrations

from api.common.migrations import get_script_sql


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0009_changes_for_csv_import'),
    ]

    operations = [
        migrations.RunSQL(get_script_sql('0010_rename_view.sql'))
    ]
