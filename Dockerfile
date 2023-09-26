# STAGE 1: Building the base image.
################################################
FROM node:18-alpine3.18 as base

WORKDIR /app
COPY ./package.json .
COPY ./tsconfig.json .

COPY ./src ./src
COPY ./test ./test

ARG DEV=false

RUN npm install && \
    npm run build

WORKDIR /app

# STAGE 2: Building the final image.
################################################
FROM base as final

WORKDIR /app

COPY --from=base /app/package.json .
COPY --from=base /app/dist/ /app/dist/

RUN npm install --production && \
    if [ "$DEV" = "true" ]; \
        then npm install; \
        else npm prune --production; \
    fi
    

EXPOSE 8000

CMD ["npm", "run", "prod"]
