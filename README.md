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
```
git clone [repo]
```
Then navigate to that new folder
```
cd [folder]
```
### 2. Configure the project
You will need to create the environment variables and any other private variables (secrets) the project uses, you can easily do so with this command which will walk you through the steps:  
```
npm run config
```
This will create a .env file [...]
### 3. Build Docker
The next command builds the docker containers:  
```
docker build .
```
### 4. Run Docker
After the docker containers are built, you simply need to run them with this command to activate the server and database:  
```
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
```
docker exec -it api sh
```

After the container shell is opened, you are able to run tests on the active Node server. Node: the server must be running while tests are performing. To run the `mocha` test suite, use the following command:  
<br>
**Run Unit Tests**
```
npm test
```

## Tutorial
*Coming soon!*

