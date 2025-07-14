FROM ghcr.io/osgeo/gdal:alpine-normal-3.7.2

RUN apk add --update --no-cache openssh
RUN adduser -D geoprocessing
COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 22
