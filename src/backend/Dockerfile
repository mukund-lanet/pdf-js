# Use the official Node.js runtime as the base image
FROM node:16.16.0-alpine

# Set environment variable 
#ENV NODE_ENV=development

# Set the working directory in the container
WORKDIR /app

# Copy the rest of your application code to the container
COPY . .

# Expose the port your Express.js app listens on
EXPOSE 8080

# Start your Express.js application
CMD ["node", "dist/src/server.js"]
