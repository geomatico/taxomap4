from django.db import migrations

from api.common.migrations import get_script_sql


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0005_create_tables_and_views_for_resource_generation'),
    ]

    operations = [
        migrations.RunSQL(get_script_sql('0006_basis_of_record_institution_tables.sql'))
    ]
