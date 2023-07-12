# pewpui

## Configure Directus to use Keycloak as Authentication Provider

Run, locally using docker-compose, Directus using Keycloak as an IDP.

### Services

* Keycloak (`keycloak`, `keycloak`): <http://keycloak.local:8056/auth/>
* Directus (`admin@example.com`, `d1r3ctu5`): <http://directus.local:8055/admin/#/login>

### Local setup

In /etc/hosts, add

```bash
127.0.0.1 keycloak.local directus.local
```

Run:

```bash
docker-compose up -d --build
```

### Config

Config Directus:

* Create new Role `Guest` via the `Settings>Roles&Permissions` menus
  * get the item ID of the role (via the url),
  * paste the value in the `docker-compose.yml` file as en environnment variable of the directus service
  
  ```yaml
  directus:
    environment:
      AUTH_KEYCLOAK_DEFAULT_ROLE_ID: <roleID>
  ```

Config Keycloak:

1. Create the `pewpui` realm
   * import the `configuration/keycloak/realm-pewpui.json` file
2. Create the `directus-ui` client
   * importing the `configuration/keycloak/client-durectus-ui.json` file
3. Add a user in the `pewpui` realm
   * setup the user credentials (OTP, temporary password, ...)
4. Restart docker-compose

  ```bash
  docker-compose stop
  docker-compose up -d
  ```

note:
* http://keycloak.local:8056/auth/realms/pewpui/.well-known/openid-configuration

## Cleanup the project

The following steps will delete all the containers/networks/volumes defined in the docker-compose project

1. stop all the containers

  ```bash
  docker-compose stop
  ```

2. remove all the services (containers/netowrks/volumes)

  ```bash
  docker-compose rm -fsv 
  docker volume list
  docker volume rm XXX
  ```

  Where XXX is the name of the volume to delete
