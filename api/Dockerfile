FROM node:22-alpine AS builder

WORKDIR /opt/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

##### STAGE 2 #####

FROM node:22-alpine

WORKDIR /opt/app

ENV NODE_ENV production

COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package.json ./package.json

EXPOSE 3000

CMD [ "npm", "start" ]
