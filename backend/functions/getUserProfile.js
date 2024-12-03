import connectDB from '../config/database.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { verifyToken } from '../utils/jwt.js';
import { errorHandler } from '../utils/errorHandler.js';

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Not authorized' }) };
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    const profile = await Profile.findOne({ user: decoded.id });

    if (!user || !profile) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User or profile not found' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user, profile })
    };
  } catch (error) {
    return errorHandler(error);
  }
};