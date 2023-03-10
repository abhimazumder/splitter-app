FROM node:bullseye

MAINTAINER Abhishek abhishek.am988@gmail.com

USER root

WORKDIR /project

COPY package*.json ./

RUN npm install

RUN npm i nodemon -g

COPY . .

EXPOSE 3003

CMD ["npm", "start"]