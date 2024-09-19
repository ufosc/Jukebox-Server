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

Copy this command to quickly get started. Must have docker, docker-compose, and git installed.

```sh
git clone git@github.com:ufosc/Jukebox-Server.git && cd Jukebox-Server && cp sample.env .env && docker-compose up --build
```

## Getting started

Use the following commands to download the project locally and get it running with nodemon.

```sh
git clone <git url>
cd Jukebox-Server

cp sample.env .env
docker-compose build
docker-compose up
```

We use docker compose to easily connect to databases and other container images. It could alternatively be run using `npm run dev`; however, this is not guaranteed to always work.

Once the server is running, visit <https://localhost:8000/login> to authenticate with Spotify.

## Technology Stack (with documentation link)

| Use                    | Tech                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Language               | [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)     |
| Backend Runtime        | [Node.js](https://nodejs.dev/en/learn/)                                                     |
| Backend Framework      | [Express.js](https://expressjs.com/en/4x/api.html#express)                                  |
| SQL Database           | [Postgres](https://node-postgres.com/)                                                      |
| Unit Tests             | [Mocha](https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha) |
| Auto Documentation     | [Swagger](https://swagger.io/docs/specification/about/)                                     |
| Infrastructure as Code | [Terraform](#)                                                                              |
| Hosting                | [AWS](#)                                                                                    |
| Containerization       | [Docker](https://docs.docker.com/get-started/)                                              |

## Workflow

To start with, look over the issues list and either pick out a task from there, or you can plan out your own idea. After that, clone the main branch onto you local system and get the server up and running using the commands above.

Once you have the server up and running, create a feature branch and start coding!

```sh
git checkout -b feature/something-brilliant
```

Remember, branches need to be focused on specific and full-working features. These features can be small, like adding some documentation, or large, like adding advanced authentication.

After you are finished with the feature, make sure you have written at least 3 unit tests, otherwise the pull request might not be accepted. Ideally, you should write tests before making the new feature to follow with the TDD paradigm, but this takes a bit of practice.
Include Link/Example to TDD Paradigm here.

After you are satisfied, push your branch to GitHub and submit a pull request for you new branch.

The pull request will then be tested by a maintainer, and merged into the main branch.

## Testing

When creating unit tests please use Mocha Formatting. REMEMBER TO HAVE AT LEAST 3 UNIT TESTS.
var expect = require("chai").expect;
var converter = require("../app/converter");
describe("JukeboxTest", function() {
// specification code
// Play from this specific playlist, source from another artist, etc.
});

Running the following command will run Mocha, which will look for files inside the `/test` directory.

```sh
docker-compose run --rm api sh -c "npm test"
```

When writing new tests, write them inside this `/test` directory.
