# OSC Jukebox Server

[![Unit Testing](https://github.com/ufosc/Jukebox-Server/actions/workflows/test-api.yml/badge.svg)](https://github.com/ufosc/Jukebox-Server/actions/workflows/test-api.yml)
[![Code Linting](https://github.com/ufosc/Jukebox-Server/actions/workflows/code-linting.yml/badge.svg)](https://github.com/ufosc/Jukebox-Server/actions/workflows/code-linting.yml)

Welcome to the Jukebox Server! To get the server running, you only need Node.js installed on your computer. If you want to contribute to the DevOps portion, you will also need docker and docker-compose installed.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Project Install One-Liner](#project-install-one-liner)
- [Getting started](#getting-started)
- [Technology Stack (with documentation link)](#technology-stack-with-documentation-link)
- [Workflow](#workflow)
- [Testing](#testing)

## Description

The Jukebox Server is a Node.js-based server that connects with Spotify's API, allowing users to manage and potentially play music and function like a Jukebox. Required software includes Docker, Docker Compose, and Git.
This project has two Github pages this is designated for the Backend Development. If you are interested in the Frontend Development please link here. <https://github.com/ufosc/Jukebox-Frontend>

## Project Install One-Liner

Copy and paste the following command into your terminal to clone the repository and get the server up and running.

This assumes you have **Docker**, **Docker Compose**, and **Git** installed.

```sh
git clone git@github.com:ufosc/Jukebox-Server.git && cd Jukebox-Server && cp sample.env .env && docker-compose up --build
```

## Getting started

Follow these steps to download the project locally and get it running with nodemon.

1. Clone the repository:

```sh
git clone https://github.com/ufosc/Jukebox-Server.git
cd Jukebox-Server
```

2. Set up the environment:

```sh
cp sample.env .env
```

3. Build and run the Docker containers:

```sh
docker-compose build
docker-compose up
```

We use Docker Compose to manage the server and its dependencies, including databases and other containers. While you can run the server using `npm run dev`, Docker Compose provides more reliability.

Once the server is running, visit <https://localhost:8000/login> to authenticate with Spotify.

## Technology Stack (with documentation link)

| Use                    | Tech                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Language               | [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) |
| Backend Runtime        | [Node.js](https://nodejs.dev/en/learn/)                                                 |
| Backend Framework      | [Express.js](https://expressjs.com/en/4x/api.html#express)                              |
| SQL Database           | [Postgres](https://node-postgres.com/)                                                  |
| Unit Tests             | [Jest](https://jestjs.io/docs/getting-started)                                          |
| Auto Documentation     | [Swagger](https://swagger.io/docs/specification/about/)                                 |
| Infrastructure as Code | [Terraform](https://developer.hashicorp.com/terraform/docs)                             |
| Hosting                | [AWS](https://docs.aws.amazon.com/)                                                     |
| Containerization       | [Docker](https://docs.docker.com/get-started/)                                          |

## Workflow

1. Start by reviewing the [issues list](https://github.com/ufosc/Jukebox-Server/issues) and pick a task or propose a new feature.

2. Clone the main branch onto your local system:

```sh
git clone git@github.com:ufosc/Jukebox-Server.git && cd Jukebox-Server && cp sample.env .env && docker-compose up --build
```

3. Create a feature branch:

```sh
git checkout -b feature/[insert name here]
```

_Ensure your branch focuses on a specific, fully working feature e.g. documentation, implementing new authentication logic. [Read more about feature branch workflow here](https://craftquest.io/guides/git/git-workflows/feature-branch-workflow)._

Before submitting a pull request, write at least three unit tests. If possible, follow the Test-Driven Development (TDD) paradigm, which involves writing tests before coding the feature itself. [Learn more about TDD here](https://www.browserstack.com/guide/what-is-test-driven-development).

4. Push your feature branch and submit a pull request (PR). Your PR will be reviewed and tested by a maintainer before merging.

## Testing

We use Jest for unit testing. **At least 3 unit tests** must accompany any new feature.

Example of Jest Formatting:

```
const converter = require('../app/converter');

// Example test
test('Jukebox Unit Test', () => {
  expect(converter.convertPlaylist('playlist-id')).toBe('expected-output');
});
```

To run the tests, use the following command. This will execute Jest, which will look for test files inside the `/test` directory:

```sh
docker-compose run --rm api sh -c "npm test"
```

When writing new tests, write them inside this `/test` directory.
