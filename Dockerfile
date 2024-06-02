FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install -g ionic

RUN npm install

COPY . .

EXPOSE 8100

CMD ["npx", "vite", "--host=0.0.0.0", "--port=8100"]
