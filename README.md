# OSC Jukebox Server

[![Unit Testing](https://github.com/ufosc/Jukebox-Server/actions/workflows/test-api.yml/badge.svg)](https://github.com/ufosc/Jukebox-Server/actions/workflows/test-api.yml)
[![Code Linting](https://github.com/ufosc/Jukebox-Server/actions/workflows/code-linting.yml/badge.svg)](https://github.com/ufosc/Jukebox-Server/actions/workflows/code-linting.yml)

Welcome! The Jukebox Server is a `NestJS` application server that connects with Spotify’s API, allowing users to manage, play, and queue up music like a retro jukebox found in old bars and diners. Required software includes Docker, Docker Compose, and Git. Additionally, Node.js and NPM are recommended for a better dev experience.

This repo is part of a burgeoning project of microservices whose aim is to facilitate club and group collaboration and engagement in our increasingly isolated world. Here are the current list of microservices:

- [Jukebox Server](https://github.com/ufosc/Jukebox-Server) _← you are here_
- [Jukebox Frontend](https://github.com/ufosc/Jukebox-Frontend)
- [Club Manager](https://github.com/ufosc/Club-Manager)

## Table of Contents

- [Setup](#setup)
  - [Other Commands](#other-commands)
  - [VSCode Setup](#vscode-setup)
  - [Git Workflow](#git-workflow)
  - [Setting up Spotify](#setting-up-spotify)
- [Project Structure](#project-structure)
  - [Server Tech Stack](#server-tech-stack)
  - [Production Stack](#production-stack)
  - [Environments and "Modes"](#environments-and-modes)
  - [Ports](#ports)
  - [URLs](#urls)
  - [Primary Objects](#primary-objects)
- [Resources](#resources)

## Setup

Before you begin, make sure you have docker compose installed. You can install it here: <https://docs.docker.com/compose/install/>

_You can do the following commands in terminal/Git Bash_

Clone the project:

```sh
git clone https://github.com/ufosc/Jukebox-Server.git
```

Build it with docker-compose:

```sh
docker-compose build
```

Run the project:

```sh
docker-compose up
```

### Other Commands

It may be helpful to run some of these other commands below at various points.

Run unit tests:

```sh
docker-compose run --rm server sh -c "npm run test"
```

Stop docker containers:

```sh
docker-compose down
```

Clear containers and empty the database:

```sh
docker-compose down --remove-orphans -v
```

### VSCode Setup

While you don't need Node.js locally to run the project, you'll need it for code completion in vscode (or webstorm, etc). To fully set up VSCode so there's no warnings, do the following (if applicable):

- Install Node.js: <https://nodejs.org/en/learn/getting-started/how-to-install-nodejs>
- Run `npm install` in your terminal/Git Bash
- When a popup shows to install recommended extensions, you can either click "install" or pick and choose which to install.

### Git Workflow

This setup is adapted from <https://github.com/asmeurer/git-workflow>.

The general workflow that is recommended is to do the following:

1. Clone the project
2. Fork the repo
3. Add the fork as a second origin
4. After making changes, push to fork
5. Make PR from fork
6. Pull updates from origin (osc repo)

For a more detailed explanation, look at the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

### Setting up Spotify

If you plan on working directly with the spotify integration, you will need to setup your own connection to the spotify api.

Steps:

1. Create Spotify App
2. Login with Spotify using <http://localhost:8000/api/v1/spotify/login/>

A more detailed explanation is provided here: [docs/Spotify.md](./docs/Spotify.md)

## Project Structure

### Server Tech Stack

| Tech       | Purpose                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| Docker     | Runs the server on a virtual OS, ensures consistency between environments        |
| Node.js    | JS is the primary language for this project, Node.js is a JS runtime             |
| NestJS     | Application Server framework to handle http, websockets, and database management |
| PostgreSQL | The database used to store data for the application                              |
| TypeORM    | Database object relational mapper (ORM), makes working with Postgres easier      |

### Production Stack

| Tech      | Purpose                                                        |
| --------- | -------------------------------------------------------------- |
| NGINX     | Web server, reverse proxy, and api gateway                     |
| Terraform | Manages infrastructure as code (IaC)                           |
| K8s       | Schedules and runs the server's Docker containers in a cluster |

### Environments and "Modes"

You can run the project in multiple different environments, which are referred to as "modes".

| Mode       | Purpose                                                                           |
| ---------- | --------------------------------------------------------------------------------- |
| Dev        | Main development mode, uses mock data in leu of making requests to microservices. |
| Network    | Like dev mode, but connects to microservices                                      |
| Test       | Slimmer version of dev mode for unit testing                                      |
| Production | When the project in run in a cloud environment and receiving traffic              |

### Ports

You can visit each of the ports via `localhost` or `127.0.0.1`, ex: `http://localhost:8000`

| Port | Mode    | Purpose                                       |
| ---- | ------- | --------------------------------------------- |
| 8000 | Dev     | Server port in dev mode                       |
| 8080 | Network | Api Gateway, hosts jukebox api and other apis |
| 9000 | Network | Server port in network mode                   |
| 8888 | Network | PgAdmin dashboard                             |
| 8081 | Network | Admin dashboard for club manager              |

### URLs

In dev mode you would visit these via <http://localhost:8000>, in network mode you would visit them via <http://localhost:8080>

| URL              | Purpose                                                              |
| ---------------- | -------------------------------------------------------------------- |
| /api/docs/       | API documentation for most recent version, auto generated by Swagger |
| /api/v1/jukebox/ | Manage club jukeboxes                                                |
| /api/v1/spotify/ | Manage a user's connection to spotify                                |

### Primary Objects

| Object         | Description                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Jukebox        | Acts as a proxy for a club to the Jukebox server, stores all information related to tracks, spotify, etc. |
| SpotifyAccount | Stores information related to a user's spotify connection, like access token, refresh token, etc.         |
| JukeboxLink    | Connects a SpotifyAccount to a Jukebox in a many-to-many fashion                                          |
| Track          | Data about a song, etc, from Spotify                                                                      |

## Resources

- Working with Spotify: [docs/Spotify.md](./docs/Spotify.md)
- Running project in Network Mode: [docs/Network-Mode.md](./docs/Network-Mode.md)
- Project conventions: [docs/Conventions.md](./docs/Conventions.md)
- General folder structure: [docs/Project-Structure.md](./docs/Project-Structure.md)
