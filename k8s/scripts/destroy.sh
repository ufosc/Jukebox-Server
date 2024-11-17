#!/bin/sh

set -e

kubectl delete -f . --grace-period=0 --force --wait=false

helm uninstall postgres --namespace postgres
helm uninstall redis --namespace redis
