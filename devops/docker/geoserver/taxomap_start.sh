#!/bin/bash

if [ -n "${GEOSERVER_ADMIN_PASSWORD}" ];then
  echo "GEOSERVER_ADMIN_PASSWORD has been provided, using it"
  USERS_XML=$GEOSERVER_DATA_DIR/security/usergroup/default/users.xml
  sed -i 's/<user .*admin.*/<user enabled="true" name="admin" password="'"plain:$GEOSERVER_ADMIN_PASSWORD"'"\/>/g' $USERS_XML
fi

chmod +x /usr/local/bin/start.sh
/usr/local/bin/start.sh
