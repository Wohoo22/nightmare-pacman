#FROM hub.nextshop.app/nextpay-core/ns-node-alpine:1.0.2
FROM hub.saobang.vn/nextpay-common/node:10.24.1-alpine3.11
RUN mkdir /app
WORKDIR /app


COPY package*.json ./
RUN git config --global http.sslverify "false"
RUN npm ci 

COPY . .

RUN npm run build && npm prune --production

ENV NODE_ENV=production
CMD ["npm", "start"]