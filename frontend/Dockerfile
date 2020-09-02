FROM node:12.18.2 AS build

WORKDIR /app

COPY package*.json ./

RUN yarn install
COPY . .
RUN yarn build


FROM nginx AS server
EXPOSE 80
COPY --from=build /app/public /usr/share/nginx/html