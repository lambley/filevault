# Use the official Node.js image
FROM node:latest

# Set working directory
WORKDIR /app/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy tsconfig.json (assuming it's in the root of server folder)
COPY tsconfig.json ./

# Copy the rest of the server code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 4000

# Command to run the server
CMD ["npm", "run", "start"]
