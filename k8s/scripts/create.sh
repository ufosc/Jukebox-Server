#!/bin/bash

set -e

# Apply Helm charts
helm install postgres ./charts/postgresql \
  --values=./charts/postgresql-values.yml \
  --namespace postgres \
  --create-namespace

helm install redis ./charts/redis \
  --values=./charts/redis-values.yml \
  --namespace redis \
  --create-namespace

# Apply kubernetes files
kubectl apply -f .

