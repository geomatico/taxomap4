create table basis_of_record (
    id serial primary key,
    name_ca text not null,
    name_en text not null,
    name_es text not null
);
insert into basis_of_record (
select distinct
    basisofrecord_id as id,
    split_part(basisofrecord, '/', 2) as name_ca,
    split_part(basisofrecord, '/', 1) as name_en,
    split_part(basisofrecord, '/', 3) as name_es
from taxomap);
select setval('basis_of_record_id_seq', coalesce((select max(id)::bigint + 1 from basis_of_record), 1), false);
alter table taxomap add constraint taxomap_basis_of_record_id_fk
    foreign key (basisofrecord_id) references basis_of_record(id);

create table institution (
    id serial primary key,
    name text not null
);
insert into institution (
select distinct
    institutioncode_id as id,
    institutioncode as name
from taxomap);
select setval('institution_id_seq', coalesce((select max(id)::bigint + 1 from institution), 1), false);
alter table taxomap add constraint taxomap_institution_id_fk
    foreign key (institutioncode_id) references institution(id);
