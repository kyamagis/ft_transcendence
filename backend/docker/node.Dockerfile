#### base ####
# cache our node version for installing later
FROM node:18.3.0-slim as node
FROM ubuntu:focal-20220531 as base
# Avoid running nodejs process as PID 1 (use tini)
RUN apt-get update \
    && apt-get -qq install -y --no-install-recommends \
    tini postgresql-client\
    && rm -rf /var/lib/apt/lists/*

# copy node binaries from node image
COPY --from=node /usr/local/include/ /usr/local/include/
COPY --from=node /usr/local/lib/ /usr/local/lib/
COPY --from=node /usr/local/bin/ /usr/local/bin/
# reset symlinks
RUN corepack disable && corepack enable

# create node user and group, then create app dir
RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node \
    && mkdir /app \
    && chown -R node:node /app

WORKDIR /app
USER node
COPY --chown=node:node package*.json yarn*.lock ./

### build ###
FROM base as build
RUN npm install --only=development && npm cache clean --force
COPY --chown=node:node . .

#### dev ####
FROM build as dev
# /app ディレクトリのオーナーを node ユーザーに変更し、書き込み権限を与える
USER root
RUN chown -R node:node /app
# この行を追加して書き込み権限を付与
RUN chmod -R 755 /app 
RUN chmod +x ./docker/wait-for-postgres.sh ./docker/dev.entrypoint.sh

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ./docker/wait-for-postgres.sh $DB_HOST ./docker/dev.entrypoint.sh

#### test ####
FROM build as test
RUN chmod +x ./docker/wait-for-postgres.sh ./docker/test.entrypoint.sh

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ./docker/wait-for-postgres.sh $DB_HOST ./docker/test.entrypoint.sh

#### prod ####
FROM build as prod
RUN chmod +x ./docker/wait-for-postgres.sh ./docker/prod.entrypoint.sh

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ./docker/wait-for-postgres.sh $DB_HOST ./docker/prod.entrypoint.sh
