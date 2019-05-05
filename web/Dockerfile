FROM node:10
WORKDIR /web
COPY package.json /web
RUN npm install

COPY . /web

EXPOSE 3000
CMD ["npm", "start"]