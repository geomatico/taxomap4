FROM oscarfonts/geoserver:2.24.4
LABEL org.opencontainers.image.source https://github.com/geomatico/taxomap4

WORKDIR /usr/local/tomcat/webapps/

ENV CATALINA_OPTS "${CATALINA_OPTS} -DALLOW_ENV_PARAMETRIZATION=true"

ADD docker/geoserver/taxomap_start.sh /usr/local/bin/taxomap_start.sh
RUN rm -rf /var/local/geoserver
COPY geoserver_data_dir /var/local/geoserver
ENTRYPOINT [ "/bin/sh", "/usr/local/bin/taxomap_start.sh"]