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
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Check if this is a validation error and set appropriate status
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request for validation errors
  }

  // Respond with a structured error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred. Please try again later.',
    // In production, avoid sending stack trace to the client for security
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    // Optionally include additional debug info in development
    ...(process.env.NODE_ENV !== 'production' && {
      method: req.method,
      url: req.originalUrl,
    }),
  });
};



