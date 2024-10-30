# Dockerfile

# Step 1: Use an official Node.js image as the base
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Install `ts-node` and `typescript` globally for running migrations
RUN npm install -g ts-node typescript

# Step 7: Build the application
RUN npm run build

# Step 8: Expose the application port
EXPOSE 3000

# Step 9: Set environment variables (use these in docker-compose)
ENV NODE_ENV=production
ENV PORT=3000

# Step 10: Run migrations and start the app
CMD ["sh", "-c", "npm run migrate && node dist/server.js"]
