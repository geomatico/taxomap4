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

* BDD normalizada, que se expondrá a través de GeoServer: `docker/taxomap-db/initdb-scripts/dump/20-taxomap-normalized.sql.gz`
* Fichero geoarrow para frontend: `static/data/taxomap.arrow`.
* Diccionarios para frontend: `static/data/dictionares/*.json`.

Habrá que commitear estos cambios al repo.


Al cambiar la BDD en el entorno de desarrollo, se debe hacer rebuild de ese entorno para que refleje los cambios:

```bash
cd devops/docker
docker compose build
```

Lo mismo aplica a frontend, donde habrá que parar y arrancar el dev server (comando `npm start`) para que vuelva a leer los ficheros estáticos.


# Cómo desplegar en producción

Mezclando en `main` y las actions de github harán su magia.
