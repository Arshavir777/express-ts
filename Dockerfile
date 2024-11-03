
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

# Step 10: Run migrations and start the app
CMD ["sh", "-c", "npm run migrate && npm run seed && npm run start"]
