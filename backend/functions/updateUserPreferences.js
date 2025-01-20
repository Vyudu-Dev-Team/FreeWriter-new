const connectDB = require( '../config/database.js');
  const User = require( '../models/User.js');
  const { verifyToken } = require( '../utils/jwt.js');
  const { errorHandler } = require( '../utils/errorHandler.js');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    if (event.httpMethod !== 'PUT') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Not authorized' }) };
    }

    const decoded = verifyToken(token);
    const { preferences } = JSON.parse(event.body);

    if (!preferences || typeof preferences !== 'object') {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid preferences data' }) };
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: { preferences } },
      { new: true, runValidators: true }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ preferences: user.preferences })
    };
  } catch (error) {
    return errorHandler(error);
  }
};

module.exports = {
  handler
};