FROM node:20-bookworm

WORKDIR /app

COPY ./package*.json ./

USER root

# RUN --mount=type=cache,target=/app/node_modules  \
    # --mount=type=cache,target=/usr/local/lib/node_modules  \
RUN \
    npm install -g npm && \
    npm install -g typescript && \
    # npm install -g @nestjs/cli && \
    npm ci

COPY ./tsconfig*.json ./
COPY ./nest-cli.json ./
COPY ./src ./src
# COPY ./packages ./packages
COPY ./test ./test
COPY ./jest.setup.ts ./

RUN npm run build

# RUN adduser --no-create-home --system --disabled-password --disabled-login --group app-user && \
#     mkdir -p /vol/web/media && \
#     mkdir -p /vol/web/static && \
#     mkdir -p /app/dist && \
#     chown -R app-user:app-user /vol && \
#     chmod -R 755 /vol/web && \
#     chown -R app-user:app-user /app/dist && \
#     chmod -R 755 /app/dist

# USER app-user
EXPOSE 8000
VOLUME ["/app/src"]

CMD ["npm", "run", "start:prod"]
