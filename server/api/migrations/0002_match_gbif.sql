alter table taxomap add column is_visible boolean;
update taxomap set is_visible = true;
alter table taxomap alter column is_visible set not null;

alter table taxomap add column gbif_notes text;
alter table taxomap add column backbone_id int references backbone(id);
create index on taxomap(backbone_id);
