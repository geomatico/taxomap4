drop view taxomap_for_geoarrow;
create view taxomap_for_geoarrow (
    id, catalognumber, basisofrecord, institutioncode, year, geom,
    domain, kingdom, phylum, class, "order", family, genus, species, subspecies
    )
as
select taxomap.id,
       taxomap.catalog_number,
       taxomap.basis_of_record_id,
       taxomap.institution_id,
       extract(year from taxomap.event_date),
       taxomap.geometry,
       1,
       backbone_with_ancestors.kingdom_id,
       backbone_with_ancestors.phylum_id,
       backbone_with_ancestors.class_id,
       backbone_with_ancestors.order_id,
       backbone_with_ancestors.family_id,
       backbone_with_ancestors.genus_id,
       backbone_with_ancestors.species_id,
       backbone_with_ancestors.subspecies_id

from taxomap left join backbone_with_ancestors
    on taxomap.taxon_id = backbone_with_ancestors.id;
