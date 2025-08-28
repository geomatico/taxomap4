from django.conf import settings
from django.db import migrations

from api.common.migrations import ConditionalMigration


class Migration(ConditionalMigration):
    # we did this via endpoint in live environments; we just apply the result for local development
    condition = (settings.SETTINGS_MODULE and settings.SETTINGS_MODULE == 'project.settings.local')

    dependencies = [
        ('api', '0002_gbif'),
    ]

    operations = [
        migrations.RunSQL('''
create table tmp_backbone_matching (id int, backbone_id int);
copy tmp_backbone_matching from '/tmp/backbone_matching.csv' csv header;
update taxomap set backbone_id = tmp.backbone_id from tmp_backbone_matching tmp where taxomap.id = tmp.id;
drop table tmp_backbone_matching;
'''),
    ]
