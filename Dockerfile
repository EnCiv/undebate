FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

ENV MONGODB_URI=mongodb://mongo:27017
EXPOSE 3011

CMD ["npm", "start"]
