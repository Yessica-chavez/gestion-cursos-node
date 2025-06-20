# Dockerfile
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install

COPY . .

# Puerto expuesto
EXPOSE 3000

# Comando de inicio
CMD ["node", "index.js"]

