#!/bin/sh

echo -n "geoprocessing:${GEOPROCESSING_PASSWORD}" | chpasswd
chmod 777 /gdal-outputs

ssh-keygen -A
exec /usr/sbin/sshd -D -e "$@"
