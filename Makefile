include ./docker.env
ifneq ("$(wildcard ./docker.env.local)","")
include ./docker.env.local
endif

.PHONY: help
help:
	@echo ""
	@echo "Usage:"
	@echo "  make COMMAND [c=<name>]"
	@echo ""
	@echo "Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sed s/^Makefile://g \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# -----------------------------------------------------------------
#  RULES TO BUILD/RUN/MANAGE/STOP DOCKER CONTAINERS
# -----------------------------------------------------------------
.PHONY: list
list: ## List the service names available in the docker-compose files
	@$(DOCKER_COMPOSE) config --services

.PHONY: build
build: ## Build all or c=<name> images
	@$(DOCKER_COMPOSE_BUILD) $(c)

.PHONY: up
up: ## Start all or c=<name> containers in foreground
	@$(DOCKER_COMPOSE_UP) -d $(c)

.PHONY: stop
stop: ## Stop all or c=<name> containers
	@$(DOCKER_COMPOSE_STOP) $(c)

.PHONY: restart
restart: stop up ## Restart all or c=<name> containers

.PHONY: status
status: ## Show status of containers
	@$(DOCKER_COMPOSE_PS)

.PHONY: ps
ps: status ## Alias of status

.PHONY: shell
shell: ## Start a shell session in the c=<name> container
	@$(DOCKER_COMPOSE_EXEC) -T $(c) '/bin/sh'

.PHONY: exec
exec: ## Execute a cmd=<command> on a c=<name> container
	@$(DOCKER_COMPOSE_EXEC) -T $(c) $(cmd)

.PHONY: logs
logs: ## Show logs for all or c=<name> containers
	@$(DOCKER_COMPOSE_LOGS) -f $(c)

.PHONY: clean
clean: ## Clean the docker services
	@$(DOCKER_COMPOSE_DOWN)

.PHONY: clean-all
clean-all: ## Remove the docker images (docker services, network and volumes)
	@$(DOCKER_COMPOSE_DOWN) -v
	@$(DOCKER_COMPOSE_RM) -fsv

# -----------------------------------------------------------------
#  RULES TO RUN TESTS (UNIT, API, ACCEPTANCE WITH/WITHOUT CODE COVERAGE
# -----------------------------------------------------------------
.PHONY: run-tests
run-tests:
	@$(DOCKER_COMPOSE) -f docker-compose.yaml -f docker-compose.test.yaml run api-tests run $(suite) $(coverage)

.PHONY: run-tests-all
run-tests-all: ## Run the tests (unit, api, acceptance)
	@make -s run-tests suite=unit,api,acceptance

.PHONY: run-tests-unit
run-tests-unit: ## Run the unitary tests
	@make -s run-tests suite=unit

.PHONY: run-tests-unit-coverage
run-tests-unit-coverage: ## Run the unitary tests and generated the code coverage
	@make -s run-tests suite=unit coverage='--coverage --coverage-html'

.PHONY: run-tests-api
run-tests-api: ## Run the api tests
	@make -s run-tests suite=api

.PHONY: run-tests-api-coverage
run-tests-api-coverage: ## Run the api tests and generated the code coverage
	@make -s run-tests suite=api coverage='--coverage --coverage-html'

.PHONY: run-tests-acceptance
run-tests-acceptance: ## Run the acceptance tests
	@make -s run-tests suite=acceptance
