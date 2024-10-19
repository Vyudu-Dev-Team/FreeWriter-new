// Import the jsonwebtoken library for token verification
const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate a user based on JWT.
 * This function checks for a token in the request headers, verifies it,
 * and attaches the decoded user information to the request object.
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const authenticate = (req, res, next) => {
  // Retrieve the token from the authorization header
  const token = req.headers['authorization'];

  // If no token is provided, return a 403 Forbidden response
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify the token using the secret key and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    req.user = decoded;
    
    // Call the next middleware function
    next();
  } catch (error) {
    // If the token is invalid, return a 401 Unauthorized response
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Export the authenticate middleware function
module.exports = authenticate;
