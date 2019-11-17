FROM node:12.13.0-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE $PORT

CMD ["npm", "run", "start"]
#CMD ["npm", "run", "dev"]
