FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates procps

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start:prod"]