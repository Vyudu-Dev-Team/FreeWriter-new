const cron = require('node-cron');
const { notifyInactiveUsers } = require('../Services/notificationService.js');
const logger = require('./logger.js');

const scheduleNotificationTasks = () => {
  // Schedule task to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      await notifyInactiveUsers(7); // Notify users inactive for 7 days
      logger.info('Inactive users notification task completed');
    } catch (error) {
      logger.error('Error in inactive users notification task', error);
    }
  });
};

module.exports = { scheduleNotificationTasks };