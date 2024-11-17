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

# Create main namespace if it doesn't exist
kubectl create namespace main --dry-run=client -o yaml | kubectl apply -f -

# Apply kubernetes files
kubectl apply -f namespaces.yml
kubectl apply -f .

