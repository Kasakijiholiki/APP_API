# syntax=docker/dockerfile:1

 FROM node:14-alpine

# set working directory

# RUN apk add --no-cache python g++ make
# WORKDIR /app
# COPY . .

RUN mkdir -p ...
COPY . /usr/scr/lottery_app_api
WORKDIR /usr/scr/lottery_app_api
ENV PATH /usr/scr/lottery_app_api/node_modules/.bin:$PATH

# RUN yarn install --production
 RUN npm install

 CMD ["npm", "start"]

