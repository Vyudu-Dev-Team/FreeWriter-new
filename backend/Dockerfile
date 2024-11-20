   # Use the official Node.js image as a base
   FROM node:16

   # Set the working directory inside the container
   WORKDIR /usr/src/app

   # Copy package.json and package-lock.json (if available) to the working directory
   COPY package*.json ./

   # Install the dependencies
   RUN npm install

   # Copy the rest of the application code to the working directory
   COPY . .

   # Expose port 3000 for the application
   EXPOSE 3000

   # Command to run the application
   CMD ["npm", "start"]