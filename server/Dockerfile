# Server Image
################################################
FROM node:20-bookworm

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./packages /app/packages

ARG NODE_ENV=development

USER root

RUN npm install -g npm && \
    npm install -g typescript && \
    npm install -g rimraf && \
    npm install 

COPY ./tsconfig.json /app/tsconfig.json
COPY ./jest.config.ts /app/jest.config.ts
COPY ./server/ /app/server

RUN npm run build

EXPOSE 8000
VOLUME ["/app/server"]

CMD ["npm", "start"]
