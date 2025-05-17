#!/bin/sh

set -e

cd ./proxy/api

npx openapi-merge-cli
npx redocly build-docs --output=index.html
