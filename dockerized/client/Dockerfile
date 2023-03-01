FROM node:19-alpine

WORKDIR /tour_de_app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "start"]