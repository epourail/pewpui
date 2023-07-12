#!/bin/bash
HTTP_HOST=$1
HTTP_PORT=$2

exec 3<>/dev/tcp/localhost/"$HTTP_PORT"

echo -e "GET /health HTTP/1.1\nhost: $HTTP_HOST:$HTTP_PORT\n" >&3
timeout 1 cat <&3 | grep status | grep UP || exit 1