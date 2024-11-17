# Kubernetes Config

## Running Locally

### Initial Setup

1. Install docker ([install](Docker, Docker Compose ([install](https://docs.docker.com/compose/install/))))
2. Install kubectl ([install](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/))
3. Install minikube ([install](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download))

### Running cluster

1. In root project directory, navigate to the `k8s` directory and make sure the scripts are setup as executables:

   ```sh
   cd k8s
   chmod -R +x ./scripts
   ```

2. Start Minikube:

   ```sh
   minikube start
   ```

3. Apply the cluster:

   ```sh
   ./scripts/create.sh
   ```

4. Optionally, start up the minikube dashboard:

   ```sh
   minikube dashboard
   ```

5. When you are finished, destroy the local cluster:

   ```sh
   ./scripts/destroy.sh
   ```

### Accessing Cluster

The general way to access a nodeport is via the following command:

```sh
kubectl port-forward svc/service-name host-port:service-port --namespace namespace
```

Running this command will start a long-running process in that terminal tab. You would start a new terminal instance for each port you forward.

#### Forwarding Base Routes

Run this command to open up the base 8080 port onto 30080 on your local machine:

```sh
kubectl port-forward svc/proxy 30080:8080 --namespace main
```

You can test that it's working by going to <http://localhost:30080/api/docs/>

#### Forwarding Club Manager Admin

Use this command to forward the port 8081, used for the club manager site/admin, onto 30081 of your local machine:

```sh
kubectl port-forward svc/proxy 30081:8081 --namespace main
```

You can test that it's working by going to <http://localhost:30081/>
