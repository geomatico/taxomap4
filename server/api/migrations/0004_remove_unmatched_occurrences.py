from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_gbif_migration_local'),
    ]

    operations = [
        migrations.RunSQL('''
create table taxomap_unmatched as select * from taxomap where backbone_id is null;
delete from taxomap where backbone_id is null;
alter table taxomap drop column is_visible;
alter table taxomap drop column gbif_notes;
alter table taxomap alter column backbone_id set not null;
'''),
    ]
