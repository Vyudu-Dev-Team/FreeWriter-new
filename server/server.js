import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import userRoutes from './routes/users.js';
import storyRoutes from './routes/stories.js';
// ... other imports

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(apiLimiter);

// CSRF token middleware
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// Routes
app.use('/api/users', authLimiter, userRoutes);
app.use('/api/stories', storyRoutes);
// ... other routes

// Error handling middleware
app.use(errorHandler);

// ... rest of the server setup

export default app;