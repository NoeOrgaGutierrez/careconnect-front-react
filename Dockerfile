FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install -g ionic

RUN npm install

COPY . .

EXPOSE 8100

CMD ["ionic", "serve"]
