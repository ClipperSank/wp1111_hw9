FROM node:16-alpine

EXPOSE 4000

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install:pord
RUN yarn build

CMD ["yarn", "deploy"] 