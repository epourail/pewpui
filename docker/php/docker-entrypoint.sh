#!/bin/sh
set -e

echo "#"
echo "# HANDLE COMMAND : $0 $1"
echo "# $(date)"
echo "#"

if [ "$1" = 'serve' ]; then

	docker-app-prepare-php
	# docker-app-wait-db-initialized
	# docker-app-migrate-db

	exec docker-php-entrypoint "php-fpm"
fi
