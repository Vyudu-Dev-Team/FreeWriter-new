const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require('./utils/errorHandler.js');
const { handleUserRoutes, handleAIRoutes, handleNotificationRoutes } = require('./functions/routeHandlers.js');
const mongoose = require("mongoose");
const helmet = require("helmet");
const connectDB = require('./config/database.js');
const OpenAI = require("openai");
const { scheduleNotificationTasks } = require('./utils/scheduledTasks.js');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schedule notification tasks
scheduleNotificationTasks();

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://freewriter-develop-branch.netlify.app',
    'https://www.freewriter.app',
  ];

  const origin = event.headers.origin || event.headers.Origin || '*';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "*", // Default to '*' if origin is not allowed
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": isAllowedOrigin ? "Origin" : "Origin", // Helps prevent caching issues
  };

  // Handle OPTIONS (CORS preflight requests)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight successful.' }),
    };
  }

  try {
    await connectDB(); // Ensure database connection

    const path = event.path.replace('/.netlify/functions/api', '');
    console.log(`Modified path: ${path}`); // Debug path rewriting
    let response;

    // Route Handling
    if (path.startsWith('/users')) {
      response = await handleUserRoutes(event);
    } else if (path.startsWith('/ai')) {
      response = await handleAIRoutes(event);
    } else if (path.startsWith('/notifications')) {
      response = await handleNotificationRoutes(event);
    } else {
      response = notFound(event);
    }

    return {
      statusCode: response.statusCode,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response.body),
    };
  } catch (error) {
    console.error('Error occurred:', error);
    const errorResponse = errorHandler(error, event);

    return {
      ...errorResponse,
      headers: {
        ...corsHeaders,
        ...errorResponse.headers,
      },
    };
  }
};

module.exports = {
  handler
};