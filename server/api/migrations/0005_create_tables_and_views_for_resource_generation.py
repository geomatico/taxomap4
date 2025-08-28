from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0004_remove_unmatched_occurrences'),
    ]

    operations = [
        migrations.RunSQL('''
create table backbone_with_ancestors (
    id serial primary key,
    canonical_name text,
    rank text,
    kingdom_id int references backbone(id),
    phylum_id int references backbone(id),
    class_id int references backbone(id),
    order_id int references backbone(id),
    family_id int references backbone(id),
    genus_id int references backbone(id),
    species_id int references backbone(id),
    subspecies_id int references backbone(id)
);

create view taxomap_with_ancestors as select taxomap.id, taxomap.catalognumber,
   1 as domain,
   backbone.kingdom_id as kingdom,
   backbone.phylum_id as phylum,
   backbone.class_id as class,
   backbone.order_id as "order",
   backbone.family_id as family,
   backbone.genus_id as genus,
   backbone.species_id as species,
   backbone.subspecies_id as subspecies,
   taxomap.basisofrecord_id as basisofrecord,
   taxomap.institutioncode_id as institutioncode,
   taxomap.year,
   taxomap.geom
from taxomap left join backbone_with_ancestors backbone on (taxomap.backbone_id = backbone.id);
''')
    ]
