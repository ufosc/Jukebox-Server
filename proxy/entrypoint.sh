#!/bin/sh

set -e

#################################################
### Parse Template Files
#################################################

FILES=$(find /etc/nginx/ -type f -name "*.conf.tpl")
echo $FILES

for file in $FILES; do
  filename=$(echo $file | sed 's/\.tpl//g' | sed 's/\/etc\/nginx\///g')
  mkdir -p $(dirname /etc/nginx/conf.d/$filename)
  envsubst "`env | awk -F = '{printf \" $$%s\", $$1}'`" < $file > /etc/nginx/conf.d/$filename
done

#################################################
### Start NGINX
#################################################

nginx -g 'daemon off;'
