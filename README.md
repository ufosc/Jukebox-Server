# Open Source Club Jukebox

Description coming soon ...

### Technology Stack (with documentation link):
| Use | Tech |
| ----------- | ----------- |
| Virtual Environment | [Docker](https://docs.docker.com/get-started/) |
| Language | [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) |
| Backend Runtime | [Node.js](https://nodejs.dev/en/learn/) |
| Backend Framework | [Express.js](https://expressjs.com/en/4x/api.html#express) |
| SQL Database | [Postgres](https://node-postgres.com/) |
| Unit Tests | [Mocha](https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha) |
| Auto Documentation | [Swagger](https://swagger.io/docs/specification/about/)

<br>

## Contents

- [Project Prerequisites](#project-prerequisites)
- [Project Quick Setup](#project-quick-setup)
- [Project Setup Verbose](#project-setup-verbose)
    - [1. Create spotify app](#1-create-spotify-app)
    - [2. Setting up the project](#2-setting-up-the-project)
    - [3. Getting The Spotify Auth Code](#3-getting-the-spotify-auth-code)
- [Developing](#developing)
- [Tutorial](#tutorial)
    - [Using Docker](#using-docker)
    - [Using Swagger and API auto documentation](#using-swagger-and-api-auto-documentation)
- [Resources](#resources)

<hr>

## Project Prerequisites

In order to properly set up this project on your computer it is recommended that you have both Docker and Node.js installed on your computer, but technically you only need Docker. Here are the links to both installation packages:
> Download Docker: [Docker.com](https://www.docker.com/products/docker-desktop/)<br>
> Docker Tutorial: [FreeCodeCamp.org](https://www.freecodecamp.org/news/a-beginners-guide-to-docker-how-to-create-your-first-docker-application-cc03de9b639f/  )<br>

> Download Node.js: [Nodejs.org](https://nodejs.org/en/)<br>
> Node.js Tutorial: [PluralSight.com](https://www.pluralsight.com/guides/getting-started-with-nodejs)<br>

<br>

## Project Quick Setup
1. Create Spotify Developer app [here](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/). Save **Client ID** and **Client Secret**, set Redirect URI to `http://localhost:3000/spotify-login-callback`.
2. Set up project:
```sh
git clone https://github.com/IkeHunter/Jukebox.git

cd Jukebox

docker build .  # builds docker image

docker-compose run --rm api sh -c "npm run config"  # (optional) creates .env file, could do this manually

docker-compose up  # runs project on port 3000

```

3. Authenticate Spotify account by going to http://localhost:3000/login. Enter Access Token into the .env file.

<br>

## Project Setup Verbose

Below is a more in-depth explanation of the setup instructions provided in the quick setup, and is recommended if you are a beginner, encountering errors, would like to learn more about setting up Spotify, or are just plain confused (which is understandable). The guide below will take you through the 3 steps of setting up the project:
1. Creating the Spotify App
2. Setting up the Project
3. Getting the Access Token

The steps are the same ones explained in spotify's documentation, but are geared towards this project since it already implements their `login` and `callback` endpoints described in their docs.

### 1. Create spotify app
A Spotify app is essentially a spotify developer account where you can access their api and other developer services. After you get access to the dashboard you can create additional apps in the future for other personal projects.

To create an app refer to their guide: [Developer.Spotify.com](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/). During setup, here are the recommended settings:
- The name can be anything, I chose OSC Jukebox
- For Website, enter `http://localhost:3000` as this is what they will test for when you access their api
- For Redirect URI enter `http://localhost:3000/spotify-login-callback`, this is the redirect url that spotify will send you to once you are authenticated. This is also the url will give you your spotify auth token.
- Ignore Bundle IDs and Android Packages

### 2. Setting up the project
This next step involves starting up the project. If you are more comfortable with Docker or want to learn Docker, you may opt for the first method; but if you don't want to deal with docker more than you already have to - then select the second.
<br>

#### Method A: With Docker

If you prefer to work with docker, and would like to keep all of the node modules purely inside the docker container, you simple have the run the two commands below.

```sh
docker build .

docker-compose run --rm api sh -c "npm run config"
```

The Docker build command automatically runs `npm install` inside the container, initializing the project. The `npm run config` command that is passed into the second Docker command sets up the environment variables. If you prefer, you could manually create the environment variables, but this must be done before you run `docker-compose up`.
<br>
#### Method B: With Node

If you prefer to stay away from Docker and instead rely on Node, you can use the commands below.

```sh
npm install # install node packages

npm run config  # configure environment variables

docker build .  # builds docker image

docker-compose up  # runs docker container
```

This does the same thing as Method 1, except it creates all the necessary files in your local directory first and then transfers them to the Docker container - creating two instances of these files.

These commands are more straightforward than the docker commands, and are easier for those not versed in Docker, but they have more of an impact on storage.

### 3. Getting The Spotify Auth Code
Once you have the Spotify App and the project set up, the last step is to authenticate your account directly with Spotify. To do so, you must visit http://localhost:3000/login. This will redirect you to the `/spotify-token` route which will display your new **access token** in JSON format.

Take the Access Token and inter it into the `.env` file at the root of the project in the variable named `SP_ACCESS`. This will allow you to access all of Spotify's API routes.

In the project, `/login` has implemented Spotify's access token authorization code they provide on GitHub, you can look over it [here](https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js).
<br>

## Developing
There are a host of commands built in to this project to make certain tasks easier and more streamlined. Since this project is contained within Docker, running the Node server and Test suite may not be the most intuitive, however. That and more is explained below.
### Environment Setup
An example .env file can be seen in the utils file.

### *Running the server*

You can use the following command to run the Node.js server with Nodemon:
```sh
docker-compose up
```
The containers defined in `docker-compose.yml` run automatically with docker-compose, which includes starting up the database and running the `npm run dev` command which compiles the TypeScript code into JS code inside the `/dist` directory (using `npm build`), then it runs the server with Nodemon.

### *Running Tests*
In order to run tests with the docker-compose containers, the containers need to be running. In order to access the shell of the running container, you must use Docker's `exec [option] [container] [command]` commmand. Once the shell is opened, you can go ahead and run the test script defined in `package.json`.
<br>
**Open Container Shell**
```sh
docker exec -it api sh

npm test
```

This will run the Mocha tests defined inside the `test/` directory.

You can also use this docker-compose command to run tests in a running container:
```sh
docker-compose exec api sh -c "npm test"
```

### *Playground*
Sometimes you may want to test a bit of code or a feature without effecting the main project, you can do so inside the `/playground` directory created during configuration. This directory is hidden from git, so anything added to this folder will be excluded from commits, version control, and GitHub.

This directory contains a simple `server.js` file that can be run using a script defined in `package.json`. You can either run this server inside or outside of docker.

To run it with Docker:
```sh
docker-compose run --rm api sh -c "npm run playground"
```

To run it locally:
```sh
npm run playground
```

## Tutorial

### Using Docker
This runs the services defined in the docker-compose.yml file

```sh
docker-compose up
```
Instead of using the `up` command, you could also use the `run` command which is structured like this:

```sh
docker-compose run [command] [service] [command]
```
This runs the container and overrides the command specified in the `Dockerfile` with the `CMD` label. You can view the docs here: [docs.docker.com](https://docs.docker.com/engine/reference/commandline/compose_run/). Common uses are as follows:
```sh
# Run playground in docker
docker-compose run --rm api sh -c "npm run playground"

# Run Tests
docker-compose run --rm api sh -c "npm install ; npm run test"

# Run specific Test
docker-compose run --rm api sh -c "npx mocha ; npm run build ; mocha --grep 'returns status 200'"
```
Flags and Commands:
- --rm: removes the temporary container when process is done, this is important because you don't want the temporary container persisting
- api: this is the service to be run. Additionally, you could run other services defined in docker-compose.yml
- sh -c: this runs an instance of the shell and passes the command in quotations
- Commands in quotes:
    - "`npm run playground`": this runs the playground server inside a fresh docker container
    - "`npm install ; npm run test`": this runs the test suite inside a fresh container. This will fail since the server is not running
    - "`npx mocha ; npm run build ; mocha --grep 'returns status 200'`": this runs three commands separated by colons to install mocha, build the dist files, and run a specific mocha test using the --grep flag to select which test (defined using it())

### Using Swagger and API auto documentation
This project uses a tool called Swagger to auto document the API. You can view the auto created api at http://localhost:3000/doc

To develop with the Swagger tool, you need to be relatively familiar with the `swagger.ts` file, as well as how to properly write comments that Swagger will use to document the API endpoints.

To properly document an endpoint you can use the following syntax:

```javascript
/*
Only comments that start with #swagger will be recognized

#swagger.tags = ['category-of-endpoint']
#swagger.summary="Summary of endpoint shown on tab"
#swagger.description="Description of endpoint shown when tab is expanded

#swagger.responses[200] = {
    description: "description of status 200",
    schema: {
        description: "any json can go here",
    }
}
#swagger.responses[401] = {
    description: "also describe error status codes",
    schema: { $ref: '#/definitions/DefNameInSwaggerFile'}
}
*/
```

You can reference definitions created in the `swagger.ts` file by writing `$ref: '#/definitions/[name]`. This is commonly used for schemas.

## Resources
Helpful websites:

setup docker, node, postgres, typescript:<br>
https://dev.to/chandrapantachhetri/docker-postgres-node-typescript-setup-47db<br>
another getting started article: <br>https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/<br>
docker best practices with node: <br>https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/<br>

start with mocha:<br> https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha<br>
Test node api: <br>https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai<br>

Start node server: <br>https://levelup.gitconnected.com/set-up-and-run-a-simple-node-server-project-38b403a3dc09<br>

environment variables:<br>
https://itnext.io/how-to-use-environment-variables-in-node-js-cb2ef0e9574a<br>

Swagger and AutoGen:<br>
https://www.npmjs.com/package/swagger-autogen?activeTab=readme#responses

### Spotify Resources
API guide:<br>
https://developer.spotify.com/documentation/general/guides/authorization/scopes/<br>

Setting up their Access Token code:<br>
https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js
