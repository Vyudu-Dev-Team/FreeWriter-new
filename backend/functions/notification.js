const connectDB = require('../config/database.js');
const User = require('../models/User.js');
const { 
  subscribeToNotifications, 
  sendEmailNotification, 
  sendPushNotification, 
  notifyInactiveUsers,
  awardPoints, 
  checkAndAwardBadge,
  getUserRewards
} = require('../services/notificationService.js');
const { errorHandler } = require('../utils/errorHandler.js');
const logger = require('../utils/logger.js');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();

    const { httpMethod, path } = event;
    const route = path.replace("/notifications", "");
    const { userId, data } = JSON.parse(event.body || '{}');

    let result;
    switch (`${httpMethod} ${route}`) {
      case "POST /subscribe":
        result = await subscribeToNotifications(userId, data.fcmToken);
        break;
      case "POST /send-email":
        result = await sendEmailNotification(userId, data.subject, data.text);
        break;
      case "POST /send-push":
        result = await sendPushNotification(userId, data.title, data.body);
        break;
      case "POST /award-points":
        result = await awardPoints(userId, data.rewardType);
        await checkAndAwardBadge(userId);
        break;
      case "GET /rewards":
        result = await getUserRewards(userId);
        break;
      case "POST /notify-inactive":
        result = await notifyInactiveUsers(data.days);
        break;
      default:
        return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };
    }

    logger.info(`Notification ${route} performed for user ${userId}`);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error in notification management', { error: error.message });
    return errorHandler(error);
  }
};

module.exports = { handler };