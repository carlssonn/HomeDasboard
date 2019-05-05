FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install

COPY config.json /app
COPY app.js /app

EXPOSE 2999
CMD ["node", "app.js"]