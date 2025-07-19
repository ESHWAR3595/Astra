# Step 1: Build the React app using Node.js v20 (slim version)
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for React app
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
