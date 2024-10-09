FROM node:22

WORKDIR /usr/src/app

# Copia e instala as dependencias.
COPY package*.json ./

RUN npm install

# Copi todos arquivos.
COPY . .

# Realizar a compilação para js.
RUN npm run build

# Expõe a porta 80.
EXPOSE 3000

# Executa a aplicação.
CMD [ "npm", "start" ]
