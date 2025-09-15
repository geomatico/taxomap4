drop view taxomap_with_ancestors;
create view taxomap_with_ancestors (
    id,
    catalog_number,
    scientific_name,
    domain_id, kingdom_id, phylum_id, class_id, order_id, family_id, genus_id, species_id, subspecies_id,
    basis_of_record_id, institution_id,
    year, month, day,
    municipality, county, state_province,
    geometry)
as
select taxomap.id,
       taxomap.catalognumber      as catalog_number,
       backbone.canonical_name    as scientific_name,
       1                          as domain_id,
       backbone.kingdom_id        as kingdom_id,
       backbone.phylum_id         as phylum_id,
       backbone.class_id          as class_id,
       backbone.order_id          as order_id,
       backbone.family_id         as family_id,
       backbone.genus_id          as genus_id,
       backbone.species_id        as species_id,
       backbone.subspecies_id     as subspecies_id,
       taxomap.basisofrecord_id   as basis_of_record_id,
       taxomap.institutioncode_id as institution_id,
       taxomap.year,
       taxomap.month,
       taxomap.day,
       taxomap.municipality,
       taxomap.county,
       taxomap.stateprovince      as state_province,
       taxomap.geom               as geometry
from taxomap left join backbone_with_ancestors backbone
    on taxomap.backbone_id = backbone.id;
