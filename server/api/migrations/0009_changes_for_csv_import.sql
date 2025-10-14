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
create view taxomap_for_geoarrow (
    id,
    catalog_number,
    domain_id, kingdom_id, phylum_id, class_id, order_id, family_id, genus_id, species_id, subspecies_id,
    basis_of_record_id, institution_id, year, geometry)
as
select taxomap.id,
       taxomap.catalog_number as catalognumber,
       1                          as domain,
       backbone.kingdom_id as kingdom,
       backbone.phylum_id as phylum,
       backbone.class_id as class,
       backbone.order_id as "order",
       backbone.family_id as family,
       backbone.genus_id as genus,
       backbone.species_id as species,
       backbone.subspecies_id as subspecies,
       taxomap.basis_of_record_id as basisofrecord,
       taxomap.institution_id as institutioncode,
       extract(year from event_date) as year,
       taxomap.geometry as geom
from taxomap left join backbone_with_ancestors backbone
    on taxomap.taxon_id = backbone.id;

update taxomap set country_code = tmp.country_code from tmp_country_code_match tmp where taxomap.id = tmp.id;
drop table tmp_country_code_match;

update taxomap set municipality = null where municipality = 'Animalia';

update taxomap set catalog_number = occurrence_id where catalog_number is null;
update taxomap_unmatched set catalognumber = occurrenceid where catalognumber is null;
alter table taxomap alter column catalog_number set not null;

delete from taxomap a using (
    select max(id) as id, institution_id, collection_code, catalog_number
    from taxomap
    group by  institution_id, collection_code, catalog_number having count(*) > 1
) b
where a.institution_id = b.institution_id and a.collection_code = b.collection_code and a.catalog_number = b.catalog_number
  and a.id != b.id;  -- 379 rows affected
alter table taxomap add constraint taxomap_occurrence_id_unique unique (institution_id, collection_code, catalog_number);
alter table taxomap drop column occurrence_id;

alter table institution add column code text unique;
alter table institution add column name_en text;
alter table institution add column name_es text;
alter table institution rename name to name_ca;
update institution set code = 'IMEDEA' where id = 1;
update institution set code = 'MCNB' where id = 2;
update institution set code = 'MVHN' where id = 3;
update institution set code = 'UB' where id = 4;
update institution set code = 'IBB' where id = 5;
update institution set name_es = 'Instituto Mediterráneo de Estudios Avanzados' where id = 1;
update institution set name_es = 'Museo de Ciencias Naturales de Barcelona' where id = 2;
update institution set name_es = 'Museo Valenciano de Historia Natural' where id = 3;
update institution set name_es = 'Universidad de Barcelona' where id = 4;
update institution set name_es = 'Instituto Botánico de Barcelona' where id = 5;
update institution set name_en = 'Mediterranean Institute for Advanced Studies' where id = 1;
update institution set name_en = 'Museum of Natural Sciences of Barcelona' where id = 2;
update institution set name_en = 'Natural History Museum of Valencia' where id = 3;
update institution set name_en = 'University of Barcelona' where id = 4;
update institution set name_en = 'Botanical Institute of Barcelona' where id = 5;

alter table basis_of_record add column code text unique;
update basis_of_record set code = 'FOSSIL' where id = 1;
update basis_of_record set code = 'NON_FOSSIL' where id = 2;
