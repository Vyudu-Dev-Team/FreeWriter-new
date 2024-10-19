const express = require('express'); 
const dotenv = require('dotenv'); 
const { db } = require('./config/firebase'); 
const userRoutes = require('./routes/userRoutes'); 

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Set up user routes for authentication-related operations
// All routes in userRoutes will be prefixed with '/api/users'
app.use('/api/users', userRoutes);

// Define the port on which the server will listen
const PORT = process.env.PORT || 5000; 

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

