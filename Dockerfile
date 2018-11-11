FROM node:10-alpine as builder

WORKDIR /webapp

COPY ./package*.json  /webapp
COPY . /webapp

RUN yarn
RUN yarn build

### RUNTIME
FROM node:10-alpine

WORKDIR /webapp

ENV NODE_ENV=production

COPY --from=builder /webapp/build/ /webapp/build/
COPY --from=builder /webapp/package.json /webapp/package.json
COPY --from=builder /webapp/yarn.lock /webapp/yarn.lock

RUN yarn --production

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE $PORT

# Commande to start the app
CMD node build/index.js
