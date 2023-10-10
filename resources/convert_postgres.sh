# Converts gpkg to geojson
ogr2ogr -f GeoJSON -lco COORDINATE_PRECISION=5 -lco WRITE_NAME=NO \
  -sql "SELECT id, catalognumber as n, domain_id as d, kingdom_id as k, phylum_id as p, class_id as c, order_id as o, family_id as f, genus_id as g, species_id as s, subspecies_id as z, basisofrecord_id as b, institutioncode_id as i, year as y, geom from taxomap" \
  taxomap_ultralite.geojson \
  PG:"host='localhost' user='taxomap' password='taxomap' dbname='taxomap' tables='taxomap'"

# Converts geojson to geoarrow (needs GDAL 3.5+, using docker)
docker run --rm -v /home:/home ghcr.io/osgeo/gdal:ubuntu-full-3.7.0 \
  ogr2ogr -lco COMPRESSION=NONE -lco BATCH_SIZE=999999 $PWD/taxomap_ultralite.arrow $PWD/taxomap_ultralite.geojson

mkdir dictionaries
TABLES="domain kingdom phylum class order family genus species subspecies basisofrecord institutioncode"
for table in $TABLES
do
  echo "Generating dictionary for \"${table}\""
  docker exec taxomap-db psql -U postgres -d taxomap -qAtX -c "select json_agg(t) FROM \"${table}\" t;" > dictionaries/${table}.json
done
