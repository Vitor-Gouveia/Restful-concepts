FROM node:alpine

WORKDIR /apps/minubooks

EXPOSE 3333

COPY . .

RUN ls -la
RUN npm install -g pnpm
RUN pnpm install

ENTRYPOINT yarn start