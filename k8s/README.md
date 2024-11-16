# Kubernetes Config

## Running Locally

### Initial Setup

1. Install docker ([install](Docker, Docker Compose ([install](https://docs.docker.com/compose/install/))))
2. Install kubectl ([install](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/))
3. Install minikube ([install](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download))

### Running cluster

1. In root project directory, navigate to the `k8s` directory:

   ```sh
   cd k8s
   ```

2. Start Minikube:

   ```sh
   minikube start
   ```

3. Apply the cluster:

   ```sh
   kubectl apply -f .
   ```

4. Optionally, start up the minikube dashboard:

   ```sh
   minikube dashboard
   ```
