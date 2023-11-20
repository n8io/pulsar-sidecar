FROM node:20-alpine

# Set the working directory in the container
WORKDIR /home/user

# Copy package.json and package-lock.json to the working directory
COPY package*.json package-lock.json ./

# Install app ALL dependencies
RUN npm ci

# Bundle app source
COPY . .

# Bundle app source
RUN npm run --silent build

ENV PORT=3500

# Expose the port the app runs on
EXPOSE 3500

# Define the command to run the app
CMD ["node", "dist/index.js"]
