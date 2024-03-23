FROM node:20.11.1-alpine3.19

ARG PORT=4000
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE $PORT
CMD ["npm", "run", "start"]