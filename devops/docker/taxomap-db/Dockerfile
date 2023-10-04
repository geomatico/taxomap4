FROM postgis/postgis:14-3.2-alpine

# Uncompress and copy db dump
COPY initdb-scripts/ /docker-entrypoint-initdb.d/
