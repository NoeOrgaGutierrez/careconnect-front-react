FROM node:latest

# Instalar Ionic globalmente
RUN npm install -g @ionic/cli

# Crear y utilizar el directorio de la aplicación
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación correrá
EXPOSE 8100

# Comando por defecto para correr la aplicación
CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "8100"]
