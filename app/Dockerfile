FROM node:18 AS development

WORKDIR /usr/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@15.2.0

COPY . .

RUN ng build
CMD ["ng", "serve", "--proxy-config", "proxy.conf.json"]


EXPOSE 4200