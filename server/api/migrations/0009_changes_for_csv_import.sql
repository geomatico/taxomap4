alter table taxomap rename geom to geometry;
alter table taxomap rename backbone_id to taxon_id;

alter table taxomap add column event_date date;
update taxomap set event_date = CASE
        WHEN year IS NULL OR month IS NULL OR day IS NULL THEN NULL
        WHEN month < 1 OR month > 12 THEN NULL
        WHEN day < 1 OR day > 31 THEN NULL
        WHEN month IN (4, 6, 9, 11) AND day > 30 THEN NULL
        WHEN month = 2 AND day > 29 THEN NULL
        WHEN month = 2 AND day = 29 AND (year % 4 != 0 OR (year % 100 = 0 AND year % 400 != 0)) THEN NULL
        ELSE make_date(year, month, day)
    END;

alter table taxomap add column georeference_verification_status text;
update taxomap set georeference_verification_status = 'UNVERIFIED';
alter table taxomap alter column georeference_verification_status set not null;

alter table taxomap add column identification_verification_status text;
update taxomap set identification_verification_status = 'UNVERIFIED';
alter table taxomap alter column identification_verification_status set not null;

alter table taxomap add column country_code text references country(code);

drop view taxomap_with_ancestors;
alter table taxomap drop column year;
alter table taxomap drop column month;
alter table taxomap drop column day;
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
       taxomap.catalog_number,
       backbone.canonical_name    as scientific_name,
       1                          as domain_id,
       backbone.kingdom_id,
       backbone.phylum_id,
       backbone.class_id,
       backbone.order_id,
       backbone.family_id,
       backbone.genus_id,
       backbone.species_id,
       backbone.subspecies_id,
       taxomap.basis_of_record_id,
       taxomap.institution_id,
       extract(year from event_date) as year,
       extract(month from event_date) as month,
       extract(day from event_date) as day,
       taxomap.municipality,
       taxomap.county,
       taxomap.state_province,
       taxomap.geometry
from taxomap left join backbone_with_ancestors backbone
    on taxomap.taxon_id = backbone.id;

update taxomap set country_code = tmp.country_code from tmp_country_code_match tmp where taxomap.id = tmp.id;
drop table tmp_country_code_match;
