FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json ./
COPY .yarnrc.yml ./

RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0"]
