import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import "./crypto-polyfill.js";
import {
  handleUserRoutes,
  handleStoryRoutes,
  handleAIRoutes,
  handleDeckRoutes,
  handleCardRoutes
} from "./routeHandlers.js";
import { getCurrentUser } from "./currentUser.js";
import connectDB from "../config/database.js";
import logger from '../utils/logger.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Debug middleware with fixed path handling
app.use((req, res, next) => {
  req.url = req.originalUrl.replace(/\/?\.netlify\/functions\/api\/?/, "/");
  logger.info("Processed Request:", {
    method: req.method,
    originalUrl: req.originalUrl,
    cleanPath: req.url,
    body: req.body,
  });
  next();
});

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    logger.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// User routes
app.post("/users/register", async (req, res) => {
  logger.info("Hit register route");
  try {
    const response = await handleUserRoutes({
      httpMethod: "POST",
      path: "/register",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    logger.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "POST",
      path: "/login",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });

    // Check if the response body is already a string
    const responseBody =
      typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

    res.status(response.statusCode).json(responseBody);
  } catch (error) {
    logger.error("Login error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Current user route
app.get("/users/current-user", getCurrentUser);

app.all("/users/verify-email", async (req, res) => {
  try {
    let token;
    if (req.method === "GET") {
      token = req.query.token;
    } else {
      token = req.body.token;
    }

    const response = await handleUserRoutes({
      httpMethod: req.method,
      path: "/verify-email",
      body: JSON.stringify({ token }),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Verification error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/users/profile", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "GET",
      path: "/profile",
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Get profile error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.put("/users/profile", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "PUT",
      path: "/profile",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.post("/users/forgot-password", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "POST",
      path: "/forgot-password",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Forgot password error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.post("/users/reset-password", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "POST",
      path: "/reset-password",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.post("/users/resend-verification", async (req, res) => {
  try {
    logger.log("Handling resend verification request:", req.body);

    const response = await handleUserRoutes({
      httpMethod: "POST",
      path: "resend-verification",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });

    // Parse the response body if it's a string
    const responseBody =
      typeof response.body === "string"
        ? JSON.parse(response.body)
        : response.body;

    res.status(response.statusCode).json(responseBody);
  } catch (error) {
    logger.error("Resend verification error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Error resending verification email",
    });
  }
});

app.get("/users/preferences", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "GET",
      path: "/preferences",
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Get preferences error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.put("/users/preferences", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "PUT",
      path: "/preferences",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Update preferences error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.post("/users/reset-preferences", async (req, res) => {
  try {
    const response = await handleUserRoutes({
      httpMethod: "POST",
      path: "/reset-preferences",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Reset preferences error:", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Story routes
app.use("/stories", async (req, res) => {
  try {
    const response = await handleStoryRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/stories/, ""),
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    logger.error("Story route error:", error);
    res.status(500).json({ message: error.message });
  }
});

// AI routes
app.use("/ai", async (req, res) => {
  try {
    const response = await handleAIRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/ai/, ""),
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    logger.error("AI route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/ai/generate-prompt", async (req, res) => {
  try {
    const response = await handleAIRoutes({
      httpMethod: "POST",
      path: "/generate-prompt",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    logger.error("Generate prompt error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/ai/generate-guidance", async (req, res) => {
  try {
    const response = await handleAIRoutes({
      httpMethod: "POST", 
      path: "/generate-guidance",
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    logger.error("Generate guidance error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/ai/submit-feedback", async (req, res) => {
  try {
    const response = await handleAIRoutes({
      httpMethod: "POST",
      path: "/submit-feedback", 
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    logger.error("Submit feedback error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/ai/dashboard-analysis', async (req, res) => {
  logger.log('Received dashboard analysis request');
  try {
    const response = await handleAIRoutes({
      path: '/ai/dashboard-analysis',
      httpMethod: 'POST',
      body: JSON.stringify(req.body)
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error('Dashboard analysis error:', error);
    res.status(500).json({ 
      message: 'Internal server error processing dashboard analysis',
      success: false 
    });
  }
});

app.use("/decks", async (req, res) => {
  try {
    const response = await handleDeckRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/decks/, ""),
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Deck route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/cards", async (req, res) => {
  try {
    const response = await handleCardRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/cards/, ""),
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Card route error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  logger.warn("404 Not Found:", {
    method: req.method,
    originalUrl: req.originalUrl,
    path: req.url,
  });
  res.status(404).json({ message: "Route not found" });
});

export const handler = serverless(app);


