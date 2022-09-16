FROM node:alpine

WORKDIR /minu-books

EXPOSE 3333

# COPY . .
COPY package.json .

COPY ./packages/server/package.json ./packages/server/

COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn ./.yarn

RUN yarn

ENTRYPOINT yarn workspace minubooks.server start