FROM node:20-alpine
WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3010
CMD [ "node", "dist/index.js" ]
