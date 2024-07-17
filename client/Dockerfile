# Use the official Node.js image with Yarn
FROM node:latest

# Set working directory
WORKDIR /app/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy tsconfig.json (assuming it's in the root of server folder)
COPY tsconfig.json ./

# Copy the rest of the client code
COPY . .

# Build the client application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the client
CMD ["npm", "start"]
