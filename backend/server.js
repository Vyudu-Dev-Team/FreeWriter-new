import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './utils/errorHandler.js';
import { handleUserRoutes, handleStoryRoutes, handleAIRoutes } from './functions/routeHandlers.js';
import mongoose from 'mongoose';
import helmet from 'helmet';
import connectDB from './config/database.js';
import OpenAI from 'openai';


// Load environment variables
dotenv.config();


// Connect to the database
connectDB();

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Comprehensive CORS configuration
// const ALLOWED_ORIGINS = [
//   'http://localhost:5173', 
//   'https://freewriter-develop-branch.netlify.app',
//   'https://www.freewriter.app'
// ];

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const ALLOWED_ORIGINS = [
    'http://localhost:5173', 
    'https://freewriter-develop-branch.netlify.app',
    'https://www.freewriter.app'
  ];

  const origin = event.headers.origin || event.headers.Origin || '*';
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin);

  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
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
    } else if (path.startsWith('/stories')) {
      response = await handleStoryRoutes(event);
    } else if (path.startsWith('/ai')) {
      response = await handleAIRoutes(event);
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