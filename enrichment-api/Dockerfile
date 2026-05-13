FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json ./
COPY .yarnrc.yml ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
