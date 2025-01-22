# TAXOMAP

## Cómo actualizar la BDD

1. En el directorio `devops/db_normalizer/initdb-scripts`, borrar el dump anterior y copiar el dump nuevo, que:
   * Debe estar en formato `.sql.gz` (texto plano comprimido, no vale el formato binario  de pg_dump, ni tar).
   * El nombre debe empezar por un número entre 2 y 8, para que se ejecute después del script `10-create-user-and-db` pero antes del `90-generate-dictionaries`.

2. Cambiar al directorio db_normalizer y ejecutar el script de normalización:
    ```bash
   cd devops/db_normalizer
    ./normalize_db.sh
    ```
   
Esto actualizará los siguientes assets:

* BDD normalizada, que se expondrá a través de GeoServer: `docker/taxomap-database/initdb-scripts/dump/20-taxomap-normalized.sql.gz`
* Fichero geoarrow para frontend: `static/data/taxomap.arrow`.
* Diccionarios para frontend: `static/data/dictionares/*.json`.

Habrá que commitear estos cambios al repo.


Al cambiar la BDD en el entorno de desarrollo, se debe hacer rebuild de ese entorno para que refleje los cambios:

```bash
cd devops/docker
docker compose build
```

Lo mismo aplica a frontend, donde habrá que parar y arrancar el dev server (comando `npm start`) para que vuelva a leer los ficheros estáticos.


## Backoffice

Se pueden gestionar usuarios a través de la API ([Djoser](https://djoser.readthedocs.io/en/latest/base_endpoints.html)).

Únicamente administradores (`is_staff` para Django) pueden gestionar usuarios.
El resto solo pueden actualizar sus datos (nombre, apellidos, ...), restablecer su contraseña y hacer login.
Esto implica que el despliegue en cualquier entorno implica crear un superusuario:

```bash
./manage.py createsuperuser
```

y luego crear los usuarios normales necesarios manualmente mediante `POST /auth/users`.

```bash
export JWT_TOKEN=$(curl http://localhost:8000/api/v1/auth/jwt/create --data '{"email": "superuser@geomatico.es", "password": "superuser"}' -H 'content-type: application/json' | jq -r .access)
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

