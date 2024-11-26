FROM oscarfonts/geoserver:2.24.4

WORKDIR /usr/local/tomcat/webapps/

ENV CATALINA_OPTS "${CATALINA_OPTS} -DALLOW_ENV_PARAMETRIZATION=true"

ADD taxomap_start.sh /usr/local/bin/taxomap_start.sh
ENTRYPOINT [ "/bin/sh", "/usr/local/bin/taxomap_start.sh"]