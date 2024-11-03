
FROM node:18-alpine

RUN npm install -g pm2

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

RUN chmod +x ./start-with-pm2.sh

# CMD ["sh", "-c", "npm run migrate && npm run seed && npm run start"]
CMD ["sh", "./start-with-pm2.sh"]
