FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE $APP_PORT

CMD ["npm", "run", "start"]
#CMD ["npm", "run", "dev"]
