# Web service with PHP/Symfony 
[![Build Status](https://travis-ci.org/epourail/template-api-symfony.svg?branch=master)](https://travis-ci.org/epourail/template-api-symfony)
[![codecov](https://codecov.io/gh/epourail/template-api-symfony/branch/master/graph/badge.svg)](https://codecov.io/gh/epourail/template-api-symfony)

This project is a template to develop/build a Symfony base-project behind a nginx server.

Features
- [x] Docker containers:
  - [x] api-php : PHP 7.3 / Symfony 5.X
  - [x] api-nginx : NGINX 1.17
  - [x] api-tests : CodeCeption 4.0
- [x] Makefile
- [x] Tests : unitary, api, acceptance
- [x] Continuous Integration : Travis
- [x] Continuous Integration : GitHub actions
- [x] Code Coverage Report : Codecov
- [x] Code quality
  - [x] PHP Code Sniffer (phpcs)
  - [x] PHP Static Analysis (phpstan) 

## Build

Use a `Makefile` to run commands

```bash
➜ make help                  

Usage:
  make COMMAND [c=<name>]

Commands:
  list                 List the service names available in the docker-compose files
  build                Build all or c=<name> images
  up                   Start all or c=<name> containers in foreground
  stop                 Stop all or c=<name> containers
  restart              Restart all or c=<name> containers
  status               Show status of containers
  ps                   Alias of status
  shell                Start a shell session in the c=<name> container
  exec                 Execute a cmd=<command> on a c=<name> container
  logs                 Show logs for all or c=<name> containers
  clean                Clean the docker services
  clean-all            Remove the docker images (docker services, network and volumes)
  run-tests-all        Run the tests (unit, api, acceptance)
  run-tests-unit       Run the unitary tests
  run-tests-unit-coverage Run the unitary tests and generated the code coverage
  run-tests-api        Run the api tests
  run-tests-api-coverage Run the api tests and generated the code coverage
  run-tests-acceptance Run the acceptance tests
```

### Run the project 

Build and run the containers

```bash
make build
make up
```

Liveness probe

```bash
➜ curl -i http://127.0.0.1:8881/ping
HTTP/1.1 200 OK
Server: nginx/1.17.6
Content-Type: text/plain; charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: PHP/7.3.13
Cache-Control: no-cache, private
Date: Thu, 02 Jan 2020 12:52:13 GMT
X-Robots-Tag: noindex

pong
```

Readiness probe

```bash
➜ curl -i http://127.0.0.1:8881/health
HTTP/1.1 200 OK
Server: nginx/1.17.6
Content-Type: text/plain; charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: PHP/7.3.13
Cache-Control: no-cache, private
Date: Thu, 02 Jan 2020 12:52:13 GMT
X-Robots-Tag: noindex

healthy
```

## Test

```bash
make run-tests-all
```

Note:
- The unit and api tests can be executed in local within the project via the `vendor/bin/codecept` command 
- Adding the `docker-compose.test.yaml`, you can run the tests 
via the [codeception](https://codeception.com/) container named `api-test` 
- The acceptance tests should be executed via the the `api-test` docker image

### Run the unitary tests

**via the `api-test` docker image**
```bash
make run-tests-unit
make run-tests-unit-coverage
```

**in local**
```bash
vendor/bin/codecept run unit
vendor/bin/codecept run unit --coverage --coverage-html
```

### Run the api tests

**via the `api-test` docker image**
```bash
make run-tests-api
make run-tests-api-coverage
```

**in local**
```bash
vendor/bin/codecept run api
vendor/bin/codecept run api --coverage --coverage-html
```

### Run the acceptance tests

**via the `api-test` docker image**
```bash
make run-tests-acceptance
```

**in local**
```bash
ACCEPTANCE_TEST_HOST=http://{host}:{port} vendor/bin/codecept run acceptance
```
Note : the host to test should be defined via the `ACCEPTANCE_TEST_HOST` environment variable

### Publish code coverage report (on codecov.io)

```bash
CODECOV_TOKEN={token} bash <(curl -s https://codecov.io/bash) -f tests/_output/coverage.xml
```
Note : the **Codecov.io** repository token should be defined via the `CODECOV_TOKEN` environment variable
