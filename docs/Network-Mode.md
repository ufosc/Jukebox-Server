# Working in Network Mode

## Network Links

- Club Admin Dashboard: <http://localhost:8081/admin/>
- Jukebox Frontend: <http://localhost:3000>
- Aggregated Api Docs: <http://localhost:8080/api/docs/>
- Jukebox Server Api Swagger Docs: <http://localhost:9000/api/docs/>
- Club Manager Api Swagger Docs: <http://localhost:8081/api/docs/>
- Spotify Login: <http://localhost:8080/api/v1/spotify/login/>

## Initial Setup

You can run network mode in 2 ways:

1. Via the frontend docker-compose file
2. Via the server docker-compose files

### Required Tools

- Docker, Docker Compose ([install](https://docs.docker.com/compose/install/))
- Header injection browser extension:
  - [ModHeader](https://chromewebstore.google.com/detail/modheader-modify-http-hea/idgpnmonknjnojddfkpgkljpfnnfcklj?hl=en&pli=1): Chrome
  - [Requestly](https://requestly.com/blog/modify-headers-in-https-requests-and-responses-in-chrome-firefox-safari/): Chrome, Safari
  - [Modify Header Value](https://addons.mozilla.org/en-US/firefox/addon/modify-header-value/): Firefox
  - [simple-modify-headers](https://addons.mozilla.org/en-US/firefox/addon/simple-modify-header/): Firefox

Optionally:

- PgAdmin ([install](https://www.pgadmin.org/download/))

### Setup via Jukebox Frontend

#### Frontend Setup Prerequisites

- Jukebox Frontend repo cloned locally ([github](https://github.com/ufosc/Jukebox-Frontend))

#### Frontend Steps

1. In the jukebox frontend repo, run `docker-compose -f docker-compose.network.yml build` to build the frontend image for use with the docker-compose file.
2. Optionally, if you want to override the default admin credentials, you can make a copy of the sample.env file and enter your own credentials.

   ```sh
   cp sample.env .env
   ```

3. Then run `docker-compose -f docker-compose.network.yml up` to run the servers.

### Setup via Server Repos

#### Server Setup Prerequisites

- [Jukebox Server](https://github.com/ufosc/Jukebox-Server) repo cloned locally
- [Club Manager](https://github.com/ufosc/Club-Manager) repo cloned locally
- [Jukebox Frontend](https://github.com/ufosc/Jukebox-Frontend) repo cloned locally

### Server Setup

1. In teh jukebox server repo, build the images:

   ```sh
   docker-compose -f docker-compose.network.yml build
   ```

2. Run this command to run just the jukebox server:

   ```sh
   docker-compose -f docker-compose.network.yml up server
   ```

3. Run this command in the Club Manager to build the image:

   ```sh
   docker-compose -f docker-compose.network.yml build
   ```

4. If you want to change the default user, make a copy of the sample env file:

   ```sh
   cp sample.env .env
   ```

5. Then, run the club manager server:

   ```sh
   docker-compose -f docker-compose.network.yml up
   ```

6. Once the jukebox and club manager servers are running, go back to the jukebox repo and start up the proxy:

   ```sh
   docker-compose -f docker-compose.network.yml up proxy --build --force-recreate
   ```

7. In the Jukebox Frontend, start up the dev server:

   ```sh
   npm run network
   ```

### Server Setup Explanation

It's necessary to run the jukebox server and club manager server before the proxy because the proxy requires both servers to be online in order for it to run. Eventually, there will be a liveliness probe to check if they're online before starting, but for now it needs to be run only after the servers are started up.

## Setting up the network

### Instruction

Once you get the network up and running, proceed with the following steps to set up the models, Spotify, etc.

#### Models and API Auth

1. Log in to the admin dashboard using the default credentials, or you can set your own credentials using the instructions above in [Server Setup](#server-setup).
2. Create a new club in the admin dashboard, the name can be anything.
3. In the club manager swagger api docs, get a new auth token via the `/api/v1/user/token/` route.
4. Install one of the header modification plugins described in [Required Tools](#required-tools),
   and add the header `Authorization` with the value `Token token-value-here`, replacing `token-value-here` with the token you got from the club manager api.
5. In the Jukebox Server api, create a new Jukebox, and for `club_api` use the api from the new club.

#### Spotify Connection

Once you have the club model and jukebox model created, and have a way of authenticating with the api, proceed with the following steps to connect to spotify.

1. Make sure header modification extension is activated for the current tab,
   and visit the link <http://localhost:8080/api/v1/spotify/login/>.

   This will redirect you to Spotify, then once you log in to Spotify you will be redirected
   back to the jukebox server. If Spotify authentication was successful, you should
   see a block of JSON displaying your Spotify account info.

2. In the swagger docs page for Jukebox Server, use the POST route for `/api/v1/jukebox/{jukebox_id}/links`
   to create a new _Jukebox Link_ - or a connection between a Jukebox and a user's spotify account.

   For the "type" field, use "spotify", and for the email field use the email connected
   to your spotify account (doesn't need to be the same email to your Club Manager user account)

3. Log in to the admin dashboard for Jukebox Frontend at <http://localhost:3000/admin/>, and once a button appears to connect to spotify, click connect.
