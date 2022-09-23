FROM node:alpine

WORKDIR /apps/minubooks

EXPOSE 3333

COPY . .

RUN npm install

ENTRYPOINT yarn start