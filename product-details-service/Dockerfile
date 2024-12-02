# Use official Node.js image as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install sequelize-cli globally
RUN npm install -g sequelize-cli

# Copy the rest of the application code
COPY . .

# Expose port that your service is running on
EXPOSE 3002

# Command to run your application
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm start"]