# Rebuild environment
docker compose build

# Loads old db and extracts dictionaries
echo "Starting compose. Database is being normalized as part of the process."
echo "Please be patient, this will take some time..."
docker compose up -d

# Dumps normalized DB
echo "Dumping normalized database to docker/taxomap-database/initdb-scripts/dump/20-taxomap-normalized.sql.gz"
docker compose exec taxomap-old-db \
  pg_dump -U postgres -d taxomap --format=p --encoding=UTF-8 -t taxomap | gzip > ../docker/taxomap-database/initdb-scripts/dump/20-taxomap-normalized.sql.gz

# Converts postgis table to geoarrow (needs GDAL 3.5+, using docker)
echo "Creating ../../client/static/data/taxomap.arrow"
docker compose exec taxomap-gdal \
  ogr2ogr -lco COMPRESSION=NONE -lco BATCH_SIZE=999999 \
  -sql "SELECT id, catalognumber, domain_id as domain, kingdom_id as kingdom, phylum_id as phylum, class_id as class, order_id as \"order\", family_id as family, genus_id as genus, species_id as species, subspecies_id as subspecies, basisofrecord_id as basisofrecord, institutioncode_id as institutioncode, year, geom from taxomap" \
  -dialect OGRSQL \
  /home/client/static/data/taxomap.arrow \
  PG:"host='taxomap-old-db' user='taxomap' password='taxomap' dbname='taxomap' tables='taxomap'"

# Extracts static dictionaries as json
echo "Extracting dictionaries to ../../client/static/data/dictionaries/*.json"
TABLES="domain kingdom phylum class order family genus species subspecies basisofrecord institutioncode"
for table in $TABLES
do
  echo "  > Generating dictionary for \"${table}\""
  docker compose exec taxomap-old-db \
    psql -U postgres -d taxomap -qAtX -c "select json_agg(t) FROM \"${table}\" t;" > ../../client/static/data/dictionaries/${table}.json
done

echo "Shutting down services"
docker compose down
