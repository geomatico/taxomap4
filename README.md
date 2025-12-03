# TAXOMAP

* Mapa principal: https://taxomap.geomatico.es
* Planetavida (versión táctil sin enlaces externos): https://taxomap.geomatico.es/#/planetavida/
* Interfaz de admin (para actualizar datos): https://taxomap.geomatico.es/#/admin


## Crear usuarios

Todos los endpoints del backoffice necesitan de un usuario autenticado para poder utilizarse.

Para crear usuarios es necesario que exista al menos un administrador (`is_staff` en Django). En entorno dev se crea uno
con usuario info@geomatico.es y password 1234. Para otros entornos el password está configurado en
`backend.django_superuser_password` en el inventario de ansible correspondiente.

Se pueden crear usuarios normales mediante `POST /auth/users` (ver [API Djoser](https://djoser.readthedocs.io/en/latest/base_endpoints.html)).
Ejemplo con proceso de activación:

```bash
export JWT_TOKEN=$(curl http://localhost:8000/api/v1/auth/jwt/create --data '{"email": "info@geomatico.es", "password": "1234"}' -H 'content-type: application/json' | jq -r .access)
curl http://localhost:8000/api/v1/auth/users/ --data '{"firstName": "Regular", "lastName": "User", "email": "regular.user@geomatico.es", "password": "regu"}' -H 'content-type: application/json' -H "Authorization: Bearer $JWT_TOKEN"
curl http://localhost:8000/api/v1/auth/users/activation/ --data '{"uid": "<from_email_in_backend_logs>", "token": "<from_email_in_backend_logs>"}' -H 'content-type: application/json' -H "Authorization: Bearer $JWT_TOKEN"
```


## Cargar la taxonomia GBIF completa


Por defecto la BDD trae un extracto de GBIF solo con el subconjunto de taxones del dataset inicial.
Para cargar el backbone completo, existe un script en taxomap-database:

    docker exec -it taxomap-database load_backbone_data.sh

Este script se descarga los datos de https://hosted-datasets.gbif.org/datasets/backbone/2023-08-28/simple.txt.gz
y los inserta en la base de datos. Son 7 millones de registros. Tarda unos minutos.


## Forzar la regeneración de geoarrow y dictionaries para frontend

Estos recursos se regeneran cada vez que se sube un CSV desde la interfaz de admin.
Pero se puede forzar su (re)construcción mediante una llamada a la API `manage/generate-resources/`:

```
export JWT_TOKEN=$(curl http://localhost:8000/api/v1/auth/jwt/create --data '{"email": "info@geomatico.es", "password": "1234"}' -H 'content-type: application/json' | jq -r .access)
curl -X POST http://localhost/api/v1/manage/generate-resources/ -H "Accept: application/json" -H "Authorization: Bearer $JWT_TOKEN"
```


## Resetear la base de datos en Staging

La base de datos se persiste entre despliegues, ya que se pueden haber importado nuevos registros.
Si en algún momento en necesario resetearla, se puede hacer entrando en el servidor. El proceso sería:

1. Apagar Servicios
2. Borrar Volumen de datos PostGIS
3. Arrancar Servicios

```shell
ssh ubuntu@staging.geomatico.es
cd /srv/services/taxomap-staging
sudo su
docker compose down
rm -rf pgdata
exit
docker compose up -d
```

Esto volverá a ejecutar el contenido de `initdb-scripts` del contenedor de `database`, instanciando la BDD tal como se tiene en dev.
Tras resetear la BDD, será necesario cargar el backbone GBIF completo como se detalla más arriba.


## Desplegar en los servidores del Museu

Los despliegues a producción no se lanzan automáticamente en actions como pasa con staging.

Las imágenes se construyen y se suben a ghcr.io, asociadas a este repo y con tag production. 
Se pone a disposición del departamento de sistemas del museu un docker compose compilado, para que ellos solo tengan que hacer pull y up.
En el primer despliegue sí que es necesario poblar la base de datos con los datos gbif, tal como se detalla más arriba.

Subir imágenes:

    # asegurarse que estamos logueados en ghcr.io:
    docker login ghcr.io
    # nos pide user y pass. El user da igual, no lo usa, pero hay que cubrilo. El password es un personal access token de github. Hay uno en keepass.

    ansible-playbook -i inventories/prod.yml upload-production-images.yml --ask-vault-password
    # La vault pass está en su sitio. taxomap > produccion

Esta tarea, además de hacer build y push de las imágenes, genera un docker compose renderizado en `devops/docker-compose.yml`. 
Este es el que hay que mandar al museu. Como contiene contraseñas y demás configuración, no se guarda en el repo. 
Se puede usar https://cloud.geomatico.es/apps/secrets/ para hacérselo llegar.

Desde el museu, solo tienen que ejecutar docker compose pull, y docker compose up para actualizar los servicios.
