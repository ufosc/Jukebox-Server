# STAGE 1: Building the base image.
################################################
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

# STAGE 2: Building the production image.
################################################
FROM base as prod

WORKDIR /app

COPY --from=base /app/package.json .
COPY --from=base /app/dist ./dist/
COPY --from=base /app/node_modules ./node_modules/

EXPOSE 3000

CMD ["npm", "run", "prod"]
