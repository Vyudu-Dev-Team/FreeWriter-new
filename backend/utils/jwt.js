// utils/jwt.js
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import AppError from "../utils/appError.js";


/**
 * Custom error class for JWT-related errors
 */
class JWTError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = 'JWTError';
    this.statusCode = statusCode;
  }
}

/**
 * Generates a JWT token
 * @param {Object} payload - Data to be encoded in the token
 * @param {string} [expiresIn='24h'] - Token expiration time
 * @returns {string} JWT token
 * @throws {Error} If JWT_SECRET is not configured
 */
export const generateToken = (payload, expiresIn = '24h') => {
  if (!process.env.JWT_SECRET) {
    throw new JWTError('JWT_SECRET is not configured', 500);
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {JWTError} If token is missing, invalid, or expired
 */
export const verifyToken = async (token) => {
  if (!token) {
    logger.error("Token is missing in the request.");
    throw new JWTError("Token is required");
  }

  try {
    // Log the token and the secret for debugging
    logger.info("Token to verify:", token);
    logger.info("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("Token verified successfully. Decoded payload:", decoded);
    return decoded;
  } catch (error) {
    // Provide more detailed error logging
    logger.error("Full token verification error:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    const message = 
      error.name === "TokenExpiredError" ? "Token has expired" :
      error.name === "JsonWebTokenError" ? "Invalid token signature" :
      "Token verification failed";

    logger.error(`Specific error type: ${error.name}, Message: ${message}`);
    throw new JWTError(message);
  }
};



/**
 * Verifies a JWT token from an event object
 * @param {Object} event - Event object containing the token
 * @returns {Object} Decoded token payload
 * @throws {JWTError} If token is missing, invalid, or expired
 */
export const verifyTokenFromEvent = async (event) => {
  // Extensive logging for debugging
  logger.info("Full event object for token verification:", JSON.stringify(event, null, 2));

  // Check multiple possible locations for the token
  const token = 
    event.headers?.authorization?.split(" ")[1] ||  // Bearer token in header
    event.token ||                                  // Direct token property
    event.body?.token ||                            // Token in body
    (typeof event === 'string' ? event : null);     // If event is already a token string

  logger.info("Extracted token:", token);

  if (!token) {
    logger.error("Token is missing from the event.");
    throw new AppError("Authentication token is required", 401);
  }

  try {
    logger.info("Attempting to verify token...");
    const decoded = await verifyToken(token);
    logger.info("Decoded token payload:", decoded);
    return decoded.userId;
  } catch (error) {
    logger.error("Comprehensive token verification error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw new AppError("Invalid or expired token", 401);
  }
};

/**
 * Verifies an email verification token
 * @param {string} token - Email verification token
 * @returns {Object} Decoded token payload
 * @throws {JWTError} If token is invalid or expired
 */
export const verifyEmailToken = async (token) => {
  return verifyToken(token);
};

/**
 * Extracts a token from various possible locations in a request
 * @param {Object} req - Request object
 * @returns {string|null} Extracted token or null if not found
 */
export const extractTokenFromRequest = (req) => {
  if (!req) return null;
  
  // Check Authorization header (most common method)
  const authHeader = req.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check for token in headers
  if (req.headers?.token) {
    return req.headers.token;
  }
  
  // Check query parameters
  if (req.query?.token) {
    return req.query.token;
  }
  
  // Check body
  if (req.body?.token) {
    return req.body.token;
  }
  
  return null;
};

