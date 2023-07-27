# Generates identifiers and dictionaries for all taxonomic levels into gpkg
sqlite3 taxomap.gpkg < generate_dictionaries.sql

# Converts gpkg to geojson
ogr2ogr -f GeoJSON -lco COORDINATE_PRECISION=5 -lco WRITE_NAME=NO -sql "SELECT catalognumber as id, domain_id as d, kingdom_id as k, phylum_id as p, class_id as c, order_id as o, family_id as f, genus_id as g, species_id as s, subspecies_id as z, basisofrecord_id as b, institutioncode_id as i, year as y, geom from taxomap" taxomap_ultralite.geojson taxomap.gpkg

# Converts geojson to geoarrow (needs GDAL 3.5+, using docker)
docker run --rm -v /home:/home osgeo/gdal:ubuntu-full-3.6.3 \
  ogr2ogr -lco COMPRESSION=NONE -lco BATCH_SIZE=999999 $PWD/taxomap_ultralite.arrow $PWD/taxomap_ultralite.geojson


# extract dictionaries
# npm i -g csv2json # dependency to convert from CSV to JSON
mkdir dictionaries
TABLES="domain kingdom phylum class order family genus species subspecies basisofrecord institutioncode"
for table in $TABLES
do
  sqlite3 -header -csv taxomap.gpkg "select * from \"${table}\";" | csv2json -d > dictionaries/${table}.json
done
