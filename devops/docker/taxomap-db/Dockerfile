FROM postgis/postgis:16-3.4-alpine

# Uncompress and copy db dump
COPY initdb-scripts/ /docker-entrypoint-initdb.d/
