// utils/errorHandler.js

const AppError = require( './appError.js');

const notFound = (event) => {
  return {
    statusCode: 404,
    body: JSON.stringify({ message: `Not Found - ${event.path}` }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  };
};

const errorHandler = (error, event) => {
  console.error(`[Error] ${error.message}`, {
    path: event.path,
    method: event.httpMethod,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'An unexpected error occurred';

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      success: false,
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  };
};

module.exports = {
  notFound,
  errorHandler,
};