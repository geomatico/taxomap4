from django.db import migrations

from api.common.migrations import get_script_sql


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0006_basis_of_record_institution_tables'),
    ]

    operations = [
        migrations.RunSQL(get_script_sql('0007_update_taxomap_with_ancestors_for_geoserver.sql'))
    ]
