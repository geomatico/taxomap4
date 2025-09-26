# Devops

Este directorio devops ha sido modificado en la rama production para desplegar taxomap a los servidores del museu.

No se lanza nada como actions, ya que sólo se hará un despliegue.

## Definición de la solución

Las imágenes se construyen y se suben a ghcr.io, asociadas a este repo. Se taguea con `production`.
Se pone a disposición del departamento de sistemas del museu, un docker compose compilado, para que ellos
sólo tengan que hacer `pull` y `up`.


## Tareas

Subir imágenes:

```shell
ansible-playbook -i inventories/prod-geomatico.yml upload_images.yml --ask-vault-password
```

    La vault pass está en su sitio. taxomap > produccion

Generar el compose:

```shell
ansible-playbook -i inventories/prod-geomatico.yml render_compose.yml --ask-vault-password
```

esto genera un `docker-compose.yml` dentro de `devops`. Este fichero es el que se le pasa al cliente.


Por último, y de lado del cliente, es necesario hacer login en ghcr.io a través de docker:

```shell
docker login ghcr.io
```

nos pide user y pass:
* usuario: sólo hace falta cubrirlo, pero no lo usa
* password: un personal access token que está guardado en el keepass.

Por último, desde el cliente, faltaría pactar el puerto donde estará publicado nuestro nginx, y ejecutar `docker compose up -d`.