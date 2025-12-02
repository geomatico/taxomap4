FROM ghcr.io/osgeo/gdal:alpine-normal-3.7.2
LABEL org.opencontainers.image.source https://github.com/geomatico/taxomap4

RUN apk add --update --no-cache openssh
RUN adduser -D geoprocessing
COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 22
