# Local Helm Charts

## Commands

Add new repo:

```sh
helm repo add new-repo-name https://repo-uri.example.com/new-repo-name
```

Pull new chart:

```sh
helm pull repo-name/chart-name --untar
```

Install chart:

```sh
helm install chart-name repo-name/chart-name
```

Then move the new chart into the charts directory.

## Charts

### PostgreSQL

- **Namespace**: `postgres`
- **Chart**: postgresql
- **Repo**: bitnami
- **Repo URI**: oci://registry-1.docker.io/bitnamicharts
- **Docs**: <https://artifacthub.io/packages/helm/bitnami/postgresql>

### Redis

- **Namespace**: `redis`
- **Chart**: redis
- **Repo**: bitnami
- **Repo URI**: oci://registry-1.docker.io/bitnamicharts
- **Docs**: <https://artifacthub.io/packages/helm/bitnami/redis>
