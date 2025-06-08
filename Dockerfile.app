FROM node:24-alpine3.21 as builder

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci && npm cache clean --force

COPY . .

RUN ls -la

RUN npm run build

CMD npm run start:dev