# Use Node.js as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Vite port
EXPOSE 5173

# Run in development mode (as currently used in the project)
CMD ["npm", "run", "dev", "--", "--host"]
