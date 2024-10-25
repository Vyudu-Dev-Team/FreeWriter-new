import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/users.js';
import storyRoutes from './routes/stories.js';
import admin from 'firebase-admin'; // Firebase
import { db } from './middleware/firebase.js'; // Firebase database middleware

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Apply security headers
app.use(helmet());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Configure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Define API routes
app.use('/api/users', userRoutes); // User authentication routes
app.use('/api/stories', storyRoutes); // Story-related routes

// Apply error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for testing purposes
export default app;
