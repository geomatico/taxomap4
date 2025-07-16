create table backbone (
 id serial primary key,
 parent_key int,
 basionym_key int,
 is_synonym boolean,
 status text,
 rank text,
 nom_status text[],
 constituent_key text,
 origin text,
 source_taxon_key int,

 kingdom_key int,
 phylum_key int,
 class_key int,
 order_key int,
 family_key int,
 genus_key int,
 species_key int,

 name_id int,
 scientific_name text,
 canonical_name text,
 genus_or_above text,
 specific_epithet text,
 infra_specific_epithet text,
 notho_type text,
 authorship text,
 year text,
 bracket_authorship text,
 bracket_year text,

 name_published_in text,
 issues text[]
);

copy backbone from '/tmp/gbif-backbone.txt';

alter table backbone alter column is_synonym set not null;
alter table backbone alter column status set not null;
alter table backbone alter column rank set not null;
alter table backbone alter column origin set not null;

alter table backbone add constraint backbone_parent_key_fk foreign key (parent_key) references backbone (id);
alter table backbone add constraint backbone_kingdom_fk foreign key (kingdom_key) references backbone (id);
alter table backbone add constraint backbone_phylum_fk foreign key (phylum_key) references backbone (id);
alter table backbone add constraint backbone_class_fk foreign key (class_key) references backbone (id);
alter table backbone add constraint backbone_order_fk foreign key (order_key) references backbone (id);
alter table backbone add constraint backbone_family_fk foreign key (family_key) references backbone (id);
alter table backbone add constraint backbone_genus_fk foreign key (genus_key) references backbone (id);
alter table backbone add constraint backbone_species_fk foreign key (species_key) references backbone (id);

create index on backbone(rank);
create index on backbone(status);
create index on backbone(canonical_name);
