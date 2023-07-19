# PEWPUI

## Introduction

Setup and run locally using docker-compose, the PEWPUI configuration using the Directus CMS-headless and Keycloak as an IDP.

### Services

Once launched and configured, the available services are:

* Keycloak to manage the users of the directus service
  * admin UI (`keycloak`, `keycloak`): http://pewpui.mvp.local/auth
  * http://pewpui.mvp.local:8000/auth/realms/pewpui/.well-known/openid-configuration

* Directus to manage the pewpui data:
  * admin UI (`admin@example.com`, `d1r3ctu5`): http://pewpui.mvp.local:8000/cms
  * keycloak user (`guest` or `guest@example.com`, `guest`)

* Adminer to query the database:  
  * admin UI: http://pewpui.mvp.local:8000/adminer

* Mariadb to manage the database

* Redis to manage the cached data

* Kong to manage the reverse proxy between services
  
## Getting Started

### 1. Build process

In /etc/hosts, add

```bash
127.0.0.1 pewpui.mvp.local
```

Run:

```bash
docker-compose up -d --build
```

### 2. Setup directus

* One directus is healthy, connect using the default admin account
* Create new Role `Guest` via the `Settings>Roles&Permissions` menus
  * get the item ID of the role (via the url),
  * paste the value in a `docker-compose.override.yml` file as an environnment variable of the directus service
  
  ```yaml
  version: '3.8'

  services:
    directus:
      environment:
        AUTH_KEYCLOAK_DEFAULT_ROLE_ID: <roleID>
  ```

### 4. Restart docker-compose

  ```bash
  docker-compose up -d
  ```

### 5. Test the Keycloak connection

Connect with the default `guest` Keycloak user on your Directus.

## HOWTO cleanup the project

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

  Where XXX is the name of the volume to delete
