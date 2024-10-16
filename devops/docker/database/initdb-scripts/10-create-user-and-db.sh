#!/bin/bash
set -e

psql --username ${POSTGRES_USER} --dbname ${POSTGRES_DB} -c \
  "CREATE ROLE ${TAXOMAP_USER} with LOGIN SUPERUSER encrypted password '$TAXOMAP_PASSWORD';"
psql --username ${POSTGRES_USER} --dbname ${POSTGRES_DB} -c \
  "CREATE DATABASE ${TAXOMAP_DB} WITH OWNER ${TAXOMAP_USER} ENCODING 'UTF8' CONNECTION LIMIT -1;"
psql --username ${TAXOMAP_USER} --dbname ${TAXOMAP_DB} -c \
  "CREATE EXTENSION POSTGIS;"

gunzip -c /docker-entrypoint-initdb.d/dump/20-taxomap-normalized.sql.gz | psql --username "$TAXOMAP_USER" --dbname "$TAXOMAP_DB" --no-password --no-psqlrc --quiet
