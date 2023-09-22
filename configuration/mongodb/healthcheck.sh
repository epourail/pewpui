#!/bin/sh

HTTP_HOST=$1
HTTP_PORT=$2

echo 'db.runCommand("ping").ok' | mongosh "${HTTP_HOST}:${HTTP_PORT}/test" --quiet || exit 1