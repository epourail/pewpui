#!/bin/sh

HTTP_HOST=$1
HTTP_PORT=$2

wget --no-verbose --tries=1 --spider "http://${HTTP_HOST}:${HTTP_PORT}/server/health" || exit 1