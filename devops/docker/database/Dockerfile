FROM postgis/postgis:16-3.4-alpine
LABEL org.opencontainers.image.source https://github.com/geomatico/taxomap4

# Uncompress and copy db dump
COPY initdb-scripts/ /docker-entrypoint-initdb.d/
COPY scripts/* /usr/local/bin/