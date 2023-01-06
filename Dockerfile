FROM node:17-alpine
RUN apk update && apk add git
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install -g nodemon
CMD npm run dev
EXPOSE 3330