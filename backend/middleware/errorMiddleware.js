import AppError from '../utils/appError.js';

// Middleware for handling 404 Not Found errors
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error stack trace and additional details (if in development)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${err.message}`, {
      url: req.originalUrl,
      method: req.method,
      stack: err.stack,
    });
  }

  // Determine the HTTP status code
  let statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;

  // Set the message based on whether the error is operational
  const message = err.isOperational ? err.message : 'An unexpected error occurred';

  // Respond with a structured error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }), // Include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && {
      method: req.method,
      url: req.originalUrl,
    }),
  });
};