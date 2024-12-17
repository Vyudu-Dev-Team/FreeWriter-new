const connectDB = require( '../config/database.js');
const { resetPreferences } = require( '../services/preferencesService.js');
const { verifyToken } = require( '../utils/jwt.js');
const { errorHandler } = require( '../utils/errorHandler.js');

const handler = async (event, context) => {
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

module.exports = {
  handler
};