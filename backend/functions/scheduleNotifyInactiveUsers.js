const { notifyInactiveUsers } = require('../Services/notificationService.js');
const connectDB = require('../config/database.js');
const logger = require('../utils/logger.js');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();
    
    const result = await notifyInactiveUsers(7); // Notify users inactive for 7 days
    
    logger.info('Inactive users notification task completed', result);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error in inactive users notification task', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};