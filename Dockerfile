FROM node

RUN npm install -g @ionic/cli


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 8100


CMD ["npx", "vite", "--port=8100"]
