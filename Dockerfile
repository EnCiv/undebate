FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install --unsafe-perm

ENV MONGODB_URI=mongodb://mongo:27017
EXPOSE 3011

CMD ["npm", "start"]
