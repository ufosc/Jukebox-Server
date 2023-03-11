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



## Setup

In order to properly set up this project on your computer you only need Docker Desktop, though it is recommended that you also have Node.js installed.
> Download Docker: [Docker.com](https://www.docker.com/products/docker-desktop/)  
> Docker Tutorial: [FreeCodeCamp.org](https://www.freecodecamp.org/news/a-beginners-guide-to-docker-how-to-create-your-first-docker-application-cc03de9b639f/  )

> Download Node.js: [Nodejs.org](https://nodejs.org/en/)  
> Node.js Tutorial: [PluralSight.com](https://www.pluralsight.com/guides/getting-started-with-nodejs)  

### 1. Git Clone
Once they are installed, run the following command in terminal to pull the code from GitHub:
```sh
git clone https://github.com/IkeHunter/Jukebox.git
```
Then navigate to that new folder (make sure you are in the project directory)
```sh
cd Jukebox
```
### 2. Configure the project
You will need to create the environment variables and any other private variables (secrets) the project uses, you can easily do so with this command which will walk you through the steps:  
```sh
npm run config
```
This will create a .env file that contains the necessary environment variables for the server, database, and any other applications that are used. It also creates a new directory called `/Playground` which is described below.
### 3. Build Docker
The next command builds the docker containers:  
```sh
docker build .
```
### 4. Run Docker
After the docker containers are built, you simply need to run them with this command to activate the server and database:  
```sh
docker-compose up
```

[... describe accessing localhost]

## Developing 
There are a host of commands built in to this project to make certain tasks easier and more streamlined. Since this project is contained within Docker, running the Node server and Test suite may not be the most intuitive, however. That and more is explained below.

### *Running the server*
The containers defined in docker-compose.yml run automatically with docker-compose, but this will attach the Node server to the API container - essentially making the container unable to run without Node running. To get around this you can either use docker instead of docker-compose, or just restart the docker container when you need to hard restart the server (it restarts automatically with nodemon).

### *Running Tests*
In order to run tests with the docker-compose containers, you first need to access the container shell in a new terminal window with the following command:  
<br>
**Open Container Shell**
```sh
docker exec -it api sh
```

After the container shell is opened, you are able to run tests on the active Node server. Node: the server must be running while tests are performing. To run the `mocha` test suite, use the following command:  
<br>
**Run Unit Tests**
```sh
npm test
```  

### *Playground*
Sometimes you may want to test a bit of code or a feature without effecting the main project, you can do so inside the `/playground` directory created during configuration. This directory is hidden from git, so anything added to this folder will be excluded from commits, version control, and GitHub. 

This directory contains a simple `server.js` file that can be run using the following command:  
<br>
**Open Container Shell**
```sh
npm run playground
```

## Tutorial
### Using Docker
[...Intro here...]

```sh
docker-compose up
```
This runs the services defined in the docker-compose.yml file  

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
    - "npm run playground": this runs the playground server inside a fresh docker container
    - "npm install ; npm run test": this runs the test suite inside a fresh container. This will fail since the server is not running
    - "npx mocha ; npm run build ; mocha --grep 'returns status 200'": this runs three commands separated by colons to install mocha, build the dist files, and run a specific mocha test using the --grep flag to select which test (defined using it())



## Resources
Helpful websites:  

setup docker, node, postgres, typescript:   
https://dev.to/chandrapantachhetri/docker-postgres-node-typescript-setup-47db   
another getting started article: https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/   
docker best practices with node: https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/   

start with mocha: https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha   
Test node api: https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai   

Beginner Resources:   
Start node server: https://levelup.gitconnected.com/set-up-and-run-a-simple-node-server-project-38b403a3dc09 

environment variables: https://itnext.io/how-to-use-environment-variables-in-node-js-cb2ef0e9574a
