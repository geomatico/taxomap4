#!/bin/bash
set -e

BACKBONE_FILE=/tmp/simple.txt.gz

wget -O $BACKBONE_FILE https://hosted-datasets.gbif.org/datasets/backbone/2023-08-28/simple.txt.gz
gunzip $BACKBONE_FILE # extract simple.txt

psql -a --username "$POSTGRES_USER" --dbname "$TAXOMAP_DB" << SQL
alter table backbone drop constraint backbone_parent_key_fk;
alter table backbone drop constraint backbone_kingdom_fk;
alter table backbone drop constraint backbone_phylum_fk;
alter table backbone drop constraint backbone_class_fk;
alter table backbone drop constraint backbone_order_fk;
alter table backbone drop constraint backbone_family_fk;
alter table backbone drop constraint backbone_genus_fk;
alter table backbone drop constraint backbone_species_fk;

drop index backbone_rank_idx;
drop index backbone_status_idx;
drop index backbone_canonical_name_idx;

CREATE TEMP TABLE backbone_temp (LIKE backbone);

\copy backbone_temp from '/tmp/simple.txt';

INSERT INTO backbone
SELECT * FROM backbone_temp
ON CONFLICT (id) DO UPDATE;

DROP TABLE backbone_temp;

alter table backbone add constraint backbone_parent_key_fk foreign key (parent_key) references backbone (id);
alter table backbone add constraint backbone_kingdom_fk foreign key (kingdom_key) references backbone (id);
alter table backbone add constraint backbone_phylum_fk foreign key (phylum_key) references backbone (id);
alter table backbone add constraint backbone_class_fk foreign key (class_key) references backbone (id);
alter table backbone add constraint backbone_order_fk foreign key (order_key) references backbone (id);
alter table backbone add constraint backbone_family_fk foreign key (family_key) references backbone (id);
alter table backbone add constraint backbone_genus_fk foreign key (genus_key) references backbone (id);
alter table backbone add constraint backbone_species_fk foreign key (species_key) references backbone (id);

create index backbone_rank_idx on public.backbone (rank);
create index backbone_status_idx on public.backbone (status);
create index backbone_canonical_name_idx on public.backbone (canonical_name);
SQL

rm /tmp/simple.txt
