# STAGE 1: Building the base image.
################################################
FROM node:20-bookworm AS setup

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./jest.config.ts ./jest.config.ts


ARG DEV=false

USER root

RUN npm install -g npm@10.2.1 && \
    npm install -g typescript && \
    npm install -g rimraf && \
    npm install 


# STAGE 2: Building the project.
################################################
FROM setup as build

COPY ./src ./src

RUN npm run build
    

EXPOSE 8000

CMD ["npm", "start"]
