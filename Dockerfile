   # Use the official Node.js image as a base
   FROM node:latest

   # Set the working directory inside the container
   WORKDIR /usr/src/app

   # Copy the rest of the application code to the working directory
   COPY . .

   # Install the dependencies
   RUN npm install
   
   EXPOSE 8888
   EXPOSE 5173

   # Command to run the application
   CMD ["npm", "run", "start"]
