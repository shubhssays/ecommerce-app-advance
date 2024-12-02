# Use official Node.js image as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install 

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application code
COPY . .

# Expose port that your service is running on
EXPOSE 3000

# Command to run your application using PM2
CMD ["pm2-runtime", "start", "server.js"]