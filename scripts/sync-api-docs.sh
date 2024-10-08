#!/bin/sh

set -e

cd api

npx openapi-merge-cli
npx redocly build-docs --output=index.html
