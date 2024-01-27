# OSC Jukebox Server

[![Unit Testing](https://github.com/ufosc/Jukebox-Server/actions/workflows/test-api.yml/badge.svg)](https://github.com/ufosc/Jukebox-Server/actions/workflows/test-api.yml)

Welcome to the Jukebox Server! To get the server running, you only need Node.js installed on your computer. If you want to contribute to the DevOps portion, you will also need docker and docker-compose installed.

## Table of Contents

    1. Description
        Brief Description of the Project
    2. Project Install One-Liner
        Install the Project in One-Line
    3. Getting Started
        How to download the project locally
    4. Technology Stack (documentation link)
    5. Workflow
        Current Issues
    6. Setting up Spotify
    7. Testing
        How to test new changes to your code

## Description

    The Jukebox Server is a Node.js-based server that connects with Spotify's API, allowing users to manage and potentially play music and function like a Jukebox. Required software includes Docker, Docker Compose, and Git.
    This project has two Github pages this is designated for the Backend Development. If you are interested in the Frontend Development please link here. https://github.com/ufosc/Jukebox-Frontend

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

## Setting up Spotify

The server gets its services from Spotify, as such using its developer account allows the server access to Spotify's artists, playlists, and algorithms

### 1. Create spotify app

A Spotify app is essentially a spotify developer account where you can access their api and other developer services. After you get access to the dashboard you can create additional apps in the future for other personal projects.

To create an app refer to their guide: [Developer.Spotify.com](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/). During setup, here are the recommended settings:

- The name can be anything, I chose OSC Jukebox
- For Website, enter `http://localhost:8000` as this is what they will test for when you access their api
- For Redirect URI enter `http://localhost:8000/spotify-login-callback`, this is the redirect url that spotify will send you to once you are authenticated. This is also the url will give you your spotify auth token.
- Ignore Bundle IDs and Android Packages

### 2. Getting The Spotify Auth Code

Once you have the Spotify App and the project set up, the last step is to authenticate your account directly with Spotify. To do so, you must visit <http://localhost:8000/login>. This will redirect you to the `/spotify-token` route which will display your new **access token** in JSON format.

Take the Access Token and enter it into the `.env` file at the root of the project in the variable named `SP_ACCESS`. This will allow you to access all of Spotify's API routes.

In the project, `/login` has implemented Spotify's access token authorization code they provide on GitHub, you can look over it [here](https://github.com/spotify/web-api-examples/blob/master/authentication/authorization_code/app.js).

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
