# PEWPUI

## Introduction

Setup and run locally using docker-compose, the PEWPUI configuration using the Directus CMS-headless and Keycloak as an IDP.

### Services

Once launched and configured, the available services are:

* Keycloak to manage the users of the directus service
  * admin UI (`keycloak`, `keycloak`): https://pewpui.mvp.local:8443/auth
  * https://pewpui.mvp.local:8443/auth/realms/pewpui/.well-known/openid-configuration

* Directus to manage the pewpui data:
  * admin UI (`directus@example.com`, `directus`): https://pewpui.mvp.local:8443/cms
  * keycloak user (`guest` or `guest@example.com`, `guest`)
  * keycloak admin user (`admin` or `admin@example.com`, `admin`)

* Adminer to query the database:  
  * admin UI: https://pewpui.mvp.local:8443/adminer

* Mariadb to manage the database

* Redis to manage the cached data

* Kong to manage the reverse proxy between services
  
## Getting Started

### Build process

In /etc/hosts, add

```bash
127.0.0.1 pewpui.mvp.local
```

Run:

```bash
docker-compose up -d --build
```

### Test the Directus connection

Connect with the admin `directus@example.com` account on your Directus.

### Test the Keycloak connection

Disconnect if you were already connected, and click on the `Connect with Keycloak` button.
Connect with the default `guest` Keycloak user on your Directus.

## Help

### HOWTO setup HTTPS certificate

The `./configuration/kong/certs` folder contains the certificate used by Kong.

_Note 1_: The certificate expiration date is really short so you might have to update the certificate with the following note.
_Note 2_: You can create your own certificate with the following command line from the certifs folder (delete the old ones):

```sh
openssl req -x509 -out ./configuration/kong/certs/kong.crt -keyout ./configuration/kong/certs/kong.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=pewpui.mvp.local' -extensions EXT -config <( \
   printf "[dn]\nCN=pewpui.mvp.local\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:pewpui.mvp.local\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

### HOWTO export the realm confguration

The `./configuration/keycloak/realm/realm-pewpui.json` contains the Keycloak configuration used to setup the pewpui realm.

The following steps will export the pewpui realm in order to archive the configuration (under the git source control)

1. setup the Keycloak confuration via the admin user interface
2. create a `docker-compose.override.yml` file as follow to export the pewpui realm

```yaml
version: '3.8'

services:
  keycloak:
    command: "export --file /opt/keycloak/data/tmp/realm-pewpui.json --realm pewpui --users realm_file"
    volumes:
    - ./configuration/keycloak/realm/realm-pewpui.json:/opt/keycloak/data/tmp/realm-pewpui.json:rw
```

3. restart the docker-compose project

```bash
docker-compose up -d 
```

_note_: the directus and kong services will failed 

4. rollback the changes of the `docker-compose.override.yml` file
5. restart the docker-compose project

```bash
docker-compose up -d 
```

### HOWTO cleanup the docker-compose project

The following steps will delete all the containers/networks/volumes defined in the docker-compose project

1. stop all the containers

  ```bash
  docker-compose stop
  ```

2. remove all the services (containers/networks/volumes)

  ```bash
  docker-compose rm -fsv 
  docker volume list
  docker volume rm XXX
  ```

  Where `XXX`` is the name of the volume to delete
