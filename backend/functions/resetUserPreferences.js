import connectDB from '../config/database.js';
import { resetPreferences } from '../services/preferencesService.js';
import { verifyToken } from '../utils/jwt.js';
import { errorHandler } from '../utils/errorHandler.js';

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Not authorized' }) };
    }

    const decoded = verifyToken(token);
    const defaultPreferences = await resetPreferences(decoded.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Preferences reset to default', preferences: defaultPreferences })
    };
  } catch (error) {
    return errorHandler(error);
  }
};