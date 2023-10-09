\c taxomap

CREATE TABLE taxomap AS
    SELECT geom, catalognumber, domain, kingdom, phylum, class, _order as "order", family, genus, species, subspecies, basisofrecord, institutioncode
    FROM mcnb_prod;

-- Recreate "id" so it is a real PK (unique, non-nullable)
ALTER TABLE taxomap ADD COLUMN id SERIAL PRIMARY KEY;

-- Don't allow nulls, replace by empty strings (as in other fields)
UPDATE taxomap SET class = '' WHERE class IS NULL;
UPDATE taxomap SET species = '' WHERE species IS NULL;

CREATE TABLE domain (
  id   SERIAL  PRIMARY KEY,
  name TEXT    NOT NULL
);
INSERT INTO domain (name) SELECT DISTINCT domain FROM taxomap;

ALTER TABLE taxomap ADD COLUMN domain_id INTEGER REFERENCES domain(id);
UPDATE taxomap SET domain_id = domain.id FROM domain WHERE domain.name = taxomap.domain;


CREATE TABLE kingdom (
  id        SERIAL  PRIMARY KEY,
  domain_id INTEGER NOT NULL,
  name      TEXT    NOT NULL,
  FOREIGN KEY (domain_id) REFERENCES domain(id)
);
INSERT INTO kingdom (domain_id, name) SELECT DISTINCT domain_id, kingdom FROM taxomap;
ALTER TABLE taxomap ADD COLUMN kingdom_id INTEGER REFERENCES kingdom(id);
UPDATE taxomap SET kingdom_id = kingdom.id FROM kingdom WHERE kingdom.name = taxomap.kingdom AND kingdom.domain_id = taxomap.domain_id;


CREATE TABLE phylum (
  id         SERIAL  PRIMARY KEY,
  kingdom_id INTEGER NOT NULL,
  name       TEXT    NOT NULL,
  FOREIGN KEY (kingdom_id) REFERENCES kingdom(id)
);
INSERT INTO phylum (kingdom_id, name) SELECT DISTINCT kingdom_id, phylum FROM taxomap;
ALTER TABLE taxomap ADD COLUMN phylum_id INTEGER REFERENCES phylum(id);
UPDATE taxomap SET phylum_id = phylum.id FROM phylum WHERE phylum.name = taxomap.phylum AND phylum.kingdom_id = taxomap.kingdom_id;

CREATE TABLE class (
  id        SERIAL  PRIMARY KEY,
  phylum_id INTEGER NOT NULL,
  name      TEXT    NOT NULL,
  FOREIGN KEY (phylum_id) REFERENCES phylum(id)
);
INSERT INTO class (phylum_id, name) SELECT DISTINCT phylum_id, class FROM taxomap;
ALTER TABLE taxomap ADD COLUMN class_id INTEGER REFERENCES class(id);
UPDATE taxomap SET class_id = class.id FROM class WHERE class.name = taxomap.class AND class.phylum_id = taxomap.phylum_id;


CREATE TABLE "order" (
  id       SERIAL  PRIMARY KEY,
  class_id INTEGER NOT NULL,
  name     TEXT    NOT NULL,
  FOREIGN KEY (class_id) REFERENCES class(id)
);
INSERT INTO "order" (class_id, name) SELECT DISTINCT class_id, "order" FROM taxomap;
ALTER TABLE taxomap ADD COLUMN order_id INTEGER REFERENCES "order"(id);
UPDATE taxomap SET order_id = "order".id FROM "order" WHERE "order".name = taxomap.order AND "order".class_id = taxomap.class_id;


CREATE TABLE family (
  id       SERIAL  PRIMARY KEY,
  order_id INTEGER NOT NULL,
  name     TEXT    NOT NULL,
  FOREIGN KEY (order_id) REFERENCES "order"(id)
);
INSERT INTO family (order_id, name) SELECT DISTINCT order_id, family FROM taxomap;
ALTER TABLE taxomap ADD COLUMN family_id INTEGER REFERENCES family(id);
UPDATE taxomap SET family_id = family.id FROM family WHERE family.name = taxomap.family AND family.order_id = taxomap.order_id;


CREATE TABLE genus (
  id        SERIAL  PRIMARY KEY,
  family_id INTEGER NOT NULL,
  name      TEXT    NOT NULL,
  FOREIGN KEY (family_id) REFERENCES family(id)
);
INSERT INTO genus (family_id, name) SELECT DISTINCT family_id, genus FROM taxomap;
ALTER TABLE taxomap ADD COLUMN genus_id INTEGER REFERENCES genus(id);
UPDATE taxomap SET genus_id = genus.id FROM genus WHERE genus.name = taxomap.genus AND genus.family_id = taxomap.family_id;


CREATE TABLE species (
  id       SERIAL  PRIMARY KEY,
  genus_id INTEGER NOT NULL,
  name     TEXT    NOT NULL,
  FOREIGN KEY (genus_id) REFERENCES genus(id)
);
INSERT INTO species (genus_id, name) SELECT DISTINCT genus_id, species FROM taxomap;
ALTER TABLE taxomap ADD COLUMN species_id INTEGER REFERENCES species(id);
UPDATE taxomap SET species_id = species.id FROM species WHERE species.name = taxomap.species AND species.genus_id = taxomap.genus_id;


CREATE TABLE subspecies (
  id         SERIAL  PRIMARY KEY,
  species_id INTEGER NOT NULL,
  name       TEXT    NOT NULL,
  FOREIGN KEY (species_id) REFERENCES species(id)
);
INSERT INTO subspecies (species_id, name) SELECT DISTINCT species_id, subspecies FROM taxomap WHERE subspecies != ''; -- Only for subspecies, discard indets.
ALTER TABLE taxomap ADD COLUMN subspecies_id INTEGER REFERENCES subspecies(id);
UPDATE taxomap SET subspecies_id = subspecies.id FROM subspecies WHERE subspecies.name = taxomap.subspecies AND subspecies.species_id = taxomap.species_id;


CREATE TABLE basisofrecord (
  id   SERIAL  PRIMARY KEY,
  name TEXT    NOT NULL
);
INSERT INTO basisofrecord (name) SELECT DISTINCT basisofrecord FROM taxomap;
ALTER TABLE taxomap ADD COLUMN basisofrecord_id INTEGER REFERENCES basisofrecord(id);
UPDATE taxomap SET basisofrecord_id = basisofrecord.id FROM basisofrecord WHERE basisofrecord.name = taxomap.basisofrecord;


CREATE TABLE institutioncode (
  id   SERIAL  PRIMARY KEY,
  name TEXT    NOT NULL
);
INSERT INTO institutioncode (name) SELECT DISTINCT institutioncode FROM taxomap;
ALTER TABLE taxomap ADD COLUMN institutioncode_id INTEGER REFERENCES institutioncode(id);
UPDATE taxomap SET institutioncode_id = institutioncode.id FROM institutioncode WHERE institutioncode.name = taxomap.institutioncode;

ANALYZE;
