# Converts postgis table to geoarrow (needs GDAL 3.5+, using docker)
docker run --network docker_default --rm -v /home:/home ghcr.io/osgeo/gdal:alpine-normal-3.7.2 \
  ogr2ogr -lco COMPRESSION=NONE -lco BATCH_SIZE=999999 \
  -sql "SELECT id, catalognumber, domain_id as domain, kingdom_id as kingdom, phylum_id as phylum, class_id as class, order_id as \"order\", family_id as family, genus_id as genus, species_id as species, subspecies_id as subspecies, basisofrecord_id as basisofrecord, institutioncode_id as institutioncode, year, geom from taxomap" \
  -dialect OGRSQL \
  $PWD/taxomap.arrow \
  PG:"host='taxomap-db' user='taxomap' password='taxomap' dbname='taxomap' tables='taxomap'"

mkdir dictionaries
TABLES="domain kingdom phylum class order family genus species subspecies basisofrecord institutioncode"
for table in $TABLES
do
  echo "Generating dictionary for \"${table}\""
  docker exec taxomap-db psql -U postgres -d taxomap -qAtX -c "select json_agg(t) FROM \"${table}\" t;" > dictionaries/${table}.json
done
