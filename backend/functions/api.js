const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
require("./crypto-polyfill.js");
const {
  handleUserRoutes,
  handleAIRoutes,
  handleDeckRoutes,
  handleCardRoutes,
  handleStoryMappingRoutes,
  handleOutlineRoutes,
  handleWritingEnvironmentRoutes,
  handleStoryRoutes,
  handleNotificationRoutes,
} = require("./routeHandlers.js");
const connectDB = require("../config/database.js");
const logger = require("../utils/logger.js");
const { getCurrentUser } = require("./currentUser.js");



dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const app = express();

// Configuração única do CORS
app.use(cors({
  origin: true, // Permite todas as origens em desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para processar OPTIONS
app.options('*', (req, res) => {
  res.status(200).end();
});

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

app.post("/users/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }
    
    const response = await handleUserRoutes({
      httpMethod: 'POST',
      path: "/verify-email",
      body: JSON.stringify({ token }),
      headers: req.headers,
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

// AI routes
app.post("/ai/generate-story-prompt", async (req, res) => {
  try {
    const response = await handleAIRoutes({
      httpMethod: "POST",
      path: "/generate-story-prompt",
      body: JSON.stringify(req.body), 
      headers: req.headers,
      queryStringParameters: req.query,
    });

    // Send the response back to the client
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Generate story prompt error:", error);
    // Send a 500 error if something goes wrong
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

// Story routes
app.use("/stories", async (req, res) => {
  try {
    const response = await handleStoryRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/stories/, ""),
      body: req.body, 
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    logger.error("Story route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/stories/get-or-create", async (req, res) => {
  try {
    const response = await handleStoryRoutes({
      httpMethod: "POST",
      path: "/get-or-create",
      body: JSON.stringify(req.body),
      headers: req.headers,
    });

    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Get or create story route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/stories/:id", async (req, res) => {
  try {
    const response = await handleStoryRoutes({
      httpMethod: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
      pathParameters: { id: req.params.id },
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("story route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/decks", async (req, res) => {
  try {
    const response = await handleDeckRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/decks/, ""),
      body: req.body, 
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Deck route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/decks/:id", async (req, res) => {
  try {
    const response = await handleDeckRoutes({
      httpMethod: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
      pathParameters: { id: req.params.id },
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
      path: req.path,
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Card route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/cards/:id", async (req, res) => {
  try {
    const response = await handleCardRoutes({
      httpMethod: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
      pathParameters: { id: req.params.id },
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Card route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/story-mapping", async (req, res) => {
  try {
    const response = await handleStoryMappingRoutes({
      httpMethod: req.method,
      path: req.path,
      body: req.body, 
      headers: req.headers,
      queryStringParameters: req.query,
    });

    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Story mapping route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/story-mapping/:id", async (req, res) => {
  try {
    const response = await handleStoryMappingRoutes({
      httpMethod: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
      pathParameters: { id: req.params.id }, // Ensure this is passed
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Story mapping route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/outlines", async (req, res) => {
  try {
    const response = await handleOutlineRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/outlines/, ""),
      body: req.body, 
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Outline route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/outlines/:id", async (req, res) => {
  try {

    const response = await handleOutlineRoutes({
      httpMethod: req.method,
      path: req.path, // Use originalUrl for full path
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
      pathParameters: { id: req.params.id },
    });

    // Ensure response body is parsed safely
    const responseBody = response.body ? 
      JSON.parse(response.body) : 
      { message: 'No response body' };

    res.status(response.statusCode).json(responseBody);
  } catch (error) {
    console.error('Comprehensive route error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

app.use("/writing-environment", async (req, res) => {
  try {
    const response = await handleWritingEnvironmentRoutes({
      httpMethod: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Writing environment route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/writing-environment/sessions/:id", async (req, res) => {
  try {
    const response = await handleWritingEnvironmentRoutes({
      httpMethod: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
      queryStringParameters: req.query,
      pathParameters: { id: req.params.id },
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Writing environment session route error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/notifications", async (req, res) => {
  try {
    const response = await handleNotificationRoutes({
      httpMethod: req.method,
      path: req.path.replace(/^\/notifications/, ""),
      body: req.body, 
      headers: req.headers,
      queryStringParameters: req.query,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    logger.error("Notification route error:", error);
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

module.exports.handler = serverless(app);


