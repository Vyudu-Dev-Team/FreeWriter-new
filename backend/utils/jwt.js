// utils/jwt.js
import jwt from 'jsonwebtoken';

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
    throw new JWTError('Token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    const message = error.name === 'TokenExpiredError' 
      ? 'Token has expired'
      : 'Invalid token';
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
  const { token } = event;
  return verifyToken(token);
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
  
  // Check Authorization header
  const authHeader = req.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
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