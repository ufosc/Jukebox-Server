# STAGE 1: Building the base image.
################################################
FROM node:20-alpine3.19 AS setup

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./jest.config.ts ./jest.config.ts


# ARG NODE_ENV=production

USER root

RUN npm install -g npm && \
    npm install -g typescript && \
    npm install -g rimraf && \
    npm install


# # STAGE 2: Building the project.
# ################################################
FROM setup as build

WORKDIR /app
COPY ./src /app/src

RUN npm run build

EXPOSE 80
VOLUME ["/app/src"]

CMD ["npm", "start"]
