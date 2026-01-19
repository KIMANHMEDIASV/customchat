# Start from a base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application
COPY . .

# Build and run your app (customize as needed)
RUN npm run build
CMD ["npm", "start"]
