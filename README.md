# TAXOMAP

## Setup

### Crear (super)usuarios

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


### Cargar la taxonomia GBIF completa

El dataset son ~7M de filas que importamos de un fichero de texto: https://hosted-datasets.gbif.org/datasets/backbone/2023-08-28

Por defecto la BDD trae un extracto de GBIF. Para cargar el backbone completo, montar el fichero `gbif-backbone.txt` en `/tmb/gbif-backbone.txt` y
ejecutar los siguientes comandos:

```sql
alter table backbone drop constraint backbone_parent_key_fk;
alter table backbone drop constraint backbone_kingdom_fk;
alter table backbone drop constraint backbone_phylum_fk;
alter table backbone drop constraint backbone_class_fk;
alter table backbone drop constraint backbone_order_fk;
alter table backbone drop constraint backbone_family_fk;
alter table backbone drop constraint backbone_genus_fk;
alter table backbone drop constraint backbone_species_fk;

CREATE TEMP TABLE backbone_temp (LIKE backbone);

\copy backbone_temp from '/tmp/gbif-backbone.txt';

INSERT INTO backbone
SELECT * FROM backbone_temp
ON CONFLICT (id) DO NOTHING;

DROP TABLE backbone_temp;

alter table backbone add constraint backbone_parent_key_fk foreign key (parent_key) references backbone (id);
alter table backbone add constraint backbone_kingdom_fk foreign key (kingdom_key) references backbone (id);
alter table backbone add constraint backbone_phylum_fk foreign key (phylum_key) references backbone (id);
alter table backbone add constraint backbone_class_fk foreign key (class_key) references backbone (id);
alter table backbone add constraint backbone_order_fk foreign key (order_key) references backbone (id);
alter table backbone add constraint backbone_family_fk foreign key (family_key) references backbone (id);
alter table backbone add constraint backbone_genus_fk foreign key (genus_key) references backbone (id);
alter table backbone add constraint backbone_species_fk foreign key (species_key) references backbone (id);
```


## Interfaz de  Admin: Carga y consulta de datos

Accesible en https://taxomap.geomatico.es/#/admin

Interfaz para visualizar los contenidos de Taxomap en formato de tabla y subir CSVs con
datos nuevos o actualizados, según la siguiente especificación:

* Encoding UTF-8
* Separado por comas
* Primera fila contiene nombres de los campos: `institutionCode,collectionCode,catalogNumber,basisOfRecord,taxonID,decimalLatitude,decimalLongitude,eventDate,countryCode,stateProvince,county,municipality`
* `institutionCode` es obligatorio y solo puede tomar los valores `IMEDEA, MCNB, MVHN, UB, IBB`.
* `collectionCode` es opcional e indica la colección a la que pertenece la ocurrencia.
* `catalogNumber` es obligatorio y es único dentro de una institución y colección.
* La combinación `institutionCode`+`collectionCode`+`catalogNumber` actúa de identificador único de una ocurrencia. Si ya existe esta combinación en la BDD se reemplaza por lo que venga en el CSV.
* `basisOfRecord` es obligatorio y solo puede tomar los valores `FOSSIL, NON_FOSSIL`
* `taxonID` es obligatorio y debe corresponderse con un identificador de GBIF.
* `decimalLatitude` es la latitud en grados, sistema WGS84, entre -90 y 90.
* `decimalLongitude` es la longitud en grados, sistema WGS84, entre -180 y 180.
* `eventDate` es la fecha en formato ISO `YYYY-MM-DD`. Opcional.
* `countryCode` es el código ISO de 2 letras del país. Opcional.
* `stateProvince`, `county`, `municipality` opcionales, indica las divisiones administrativas de primer (CCAA), segundo (Provincia) y tercer (Municipio) orden respectivamente. Opcionales.

Para más información sobre el significado de cada campo, referirse a la lista de términos
de Darwin Core en https://dwc.tdwg.org/list/

Al subir un CSV, si algún registro no cumple los crierios, no será validado. Se podrá
descargar un documento CSV de vuelta con los registros que no se han incorporado y
el motivo de rechazo. 


## Versión Planeta Vida (aplicación táctil)

La URL para acceder es
([https://taxomap.geomatico.es/#/planetavida/](https://taxomap.geomatico.es/#/planetavida/))


## HOW-TOs

### Forzar la regeneración de geoarrow y dictionaries para frontend

Estos recursos se regeneran cada vez que se sube un CSV desde el admin.
Pero se puede forzar su (re)construcción mediante una llamada a la API `manage/generate-resources/`:

```
export JWT_TOKEN=$(curl http://localhost:8000/api/v1/auth/jwt/create --data '{"email": "info@geomatico.es", "password": "1234"}' -H 'content-type: application/json' | jq -r .access)
curl -X POST http://localhost/api/v1/manage/generate-resources/ -H "Accept: application/json" -H "Authorization: Bearer $JWT_TOKEN"
```


### Resetear de la base de datos en Staging

Ahora mismo la base de datos se persiste entre despliegues. Si en algún momento en necesario resetearla, se puede hacer entrando en el servidor.
El proceso sería:

1. Apagar Servicios
2. Borrar Volumen
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

Esto volverá a ejecutar el contenido de `initdb-scripts` del contenedor de `database`, replicando la BDD que se tiene en entorno de desarrollo.
Tras resetear la BDD, será necesario cargar el backbone GBIF completo como se detalla más arriba.
