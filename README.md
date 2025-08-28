# TAXOMAP

## Setup

El fichero (texto) de taxonomía de GBIF se monta como un volumen en el contenedor de postgis
para cargarlo en una tabla (migración de Django).

Automáticamente se monta el fichero `server/data/gbif-backbone-test.txt` que tiene un subset
solo con lo que necesitamos.

Si por el motivo que sea se quiere cargar todo GBIF en local para desarrollar lo que sea, habrá que:
* Meter el fichero completo (https://hosted-datasets.gbif.org/datasets/backbone/2023-08-28/ ,simple.txt.gz) 
  en `server/data/gbif-backbone.txt` (descomprimido).
* Modificar `devops/inventories/dev.yml` (y/o `backend-ci.yml`) para meter `gbif-backbone.txt` en 
  `backend.extra_volumes` (en lugar de `gbif-backbone-test.txt`).

Con todo GBIF, la migración inicial tarda unos minutos.

## Backoffice

Se pueden gestionar usuarios a través de la API ([Djoser](https://djoser.readthedocs.io/en/latest/base_endpoints.html)).

Únicamente administradores (`is_staff` para Django) pueden gestionar usuarios.
El resto solo pueden actualizar sus datos (nombre, apellidos, ...), restablecer su contraseña y hacer login.
Esto implica que el despliegue en cualquier entorno implica crear un superusuario:

```bash
./manage.py createsuperuser
```

En local para pruebas ya se incluye uno por defecto (info@geomatico.es:1234).

Se pueden añadir para otros entornos configurando `backend.django_superuser_password` en el inventario de ansible correspondiente.

Luego se pueden crear los usuarios normales necesarios manualmente mediante `POST /auth/users`.

```bash
export JWT_TOKEN=$(curl http://localhost:8000/api/v1/auth/jwt/create --data '{"email": "info@geomatico.es", "password": "1234"}' -H 'content-type: application/json' | jq -r .access)
curl http://localhost:8000/api/v1/auth/users/ --data '{"firstName": "Regular", "lastName": "User", "email": "regular.user@geomatico.es", "password": "regu"}' -H 'content-type: application/json' -H "Authorization: Bearer $JWT_TOKEN"
curl http://localhost:8000/api/v1/auth/users/activation/ --data '{"uid": "<from_email_in_backend_logs>", "token": "<from_email_in_backend_logs>"}' -H 'content-type: application/json' -H "Authorization: Bearer $JWT_TOKEN"
```

Todos los endpoints del backoffice están abiertos para cualquier usuario autenticado.
Todos los endpoints del backoffice están cerrados para cualquier usuario no autenticado.

## Taxonomia

El dataset son ~7M de filas que importamos de un fichero de texto: https://hosted-datasets.gbif.org/datasets/backbone/2023-08-28

Para importar el backbone de GBIF, ejecutar ./prepare-db.sh en devops/prepare-db 
Puede tardar 10mn en descargar.


## Base de datos en Staging

Ahora mismo la base de datos se persiste entre despliegues. Si en algún momento en necesario resetearla, se puede hacer entrando en el servidor.
El proceso sería:

1. Apagar Servicios
2. Borrar Volumen
3. Arrancar Servicios

```shell
ssh ubuntu@staging.geomatico.es
cd /srv/services/taxomap-staging
docker compose down
sudo su
rm -rf pgdata
exit
docker compose up -d
```

Esto volverá a ejecutar el contenido de `initdb-scripts` del contenedor de `database`.

