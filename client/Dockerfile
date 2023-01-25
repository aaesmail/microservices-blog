FROM node:14-alpine

USER node
ENV CI=true
ENV WDS_SOCKET_PORT=0
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
RUN npm install

COPY --chown=node:node ./ ./

CMD [ "npm", "start" ]
