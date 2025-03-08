# Use Node.js LTS version as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 5000

# Command to run the app
CMD ["sh", "-c", "npx sequelize-cli db:migrate --env production && npx sequelize-cli db:seed:all --env production && npm start"]


