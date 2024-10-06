# Working in Network Mode

## Helpful Commands

To run all of the services in docker-compose.network:

```sh
docker-compose -f docker-compose.network.yml up
```

When working with NGINX, you will often need to restart it after each edit, so this would ideally run separate. The suggested solution is to run the Jukebox server independent of the proxy container. In one terminal run:

```sh
docker-compose -f docker-compose.network.yml up server
```

and in another terminal run:

```sh
docker-compose -f docker-compose.network.yml up proxy
```

This allows you to restart the proxy after changes using:

```sh
docker-compose -f docker-compose.network.yml up proxy --build --force-recreate
```

### When Running with Club Manager Repo

Start the services in this order:

1. Start jukebox server

   ```sh
   # dir: Jukebox-Server/
   docker-compose -f docker-compose.network.yml up server
   ```

2. Start Club Manager

   ```sh
   # dir: Club-Manager/
   docker-compose -f docker-compose.network.yml up
   ```

3. Start Proxy

   ```sh
   # dir: Jukebox-Server/
   docker-compose -f docker-compose.network.yml up proxy --build --force-recreate
   ```
