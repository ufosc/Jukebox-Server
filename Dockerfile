# # Installs Node.js image from docker
# FROM node:16.13.1-alpine3.14

# # sets the working directory for any RUN, CMD, COPY command in the docker image
# # all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
# WORKDIR /usr/src/app

# # Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR in Docker image
# COPY ["package.json", "tsconfig.json", "./"]

# # Copies everything in the local src directory to Docker WORKDIR/src
# COPY ./src ./src

# # Installs all packages in Docker container
# RUN npm install

# # Runs the dev npm script to build & start the server inside docker container
# CMD npm run dev

FROM node:16.13.1-alpine3.14 as base

WORKDIR /app
COPY ./package.json .
COPY ./tsconfig.json .

RUN npm install

COPY ./src ./src

ARG DEV=false

RUN npm run build && npm prune --production && \
    if [ "$DEV" = "true" ]; \
        then npm install -g nodemon; \
    fi

FROM base as prod

WORKDIR /app

COPY --from=base /app/package.json .
COPY --from=base /app/dist ./dist/
COPY --from=base /app/node_modules ./node_modules/

EXPOSE 3000

# CMD ["node", "dist/server.js"]
ENTRYPOINT ["npm", "run", "prod"]



