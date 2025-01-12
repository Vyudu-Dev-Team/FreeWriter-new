const admin = require('firebase-admin');
const User = require('../models/User.js');
const logger = require('../utils/logger.js');
const { sendEmail } = require('../utils/sendEmail.js');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const notifyInactiveUsers = async (days) => {
  try {
    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - days);

    const inactiveUsers = await User.find({ lastActive: { $lt: inactiveDate } });

    for (const user of inactiveUsers) {
      // Send email notification
      await sendEmailNotification(
        user._id,
        'We miss you!',
        `Hi ${user.username}, it's been a while since you've used FreeWriter. Come back and continue your writing journey!`
      );

      // Send push notification if FCM token is available
      if (user.fcmToken) {
        await sendPushNotification(
          user._id,
          'We miss you!',
          'Return to FreeWriter and continue your writing journey!'
        );
      }

      // Update user's lastActive field
      user.lastActive = new Date();
      await user.save();
    }

    logger.info(`Notified ${inactiveUsers.length} inactive users`);
    return { message: `Notified ${inactiveUsers.length} inactive users` };
  } catch (error) {
    logger.error('Error notifying inactive users:', error);
    throw error;
  }
};

const subscribeToNotifications = async (userId, fcmToken) => {
  const user = await User.findByIdAndUpdate(userId, { fcmToken }, { new: true });
  return { message: 'Successfully subscribed to push notifications' };
};

const sendEmailNotification = async (userId, subject, text) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      throw new Error('User not found or email not available');
    }

    await sendEmail({
      to: user.email,
      subject: subject,
      text: text,
      html: `<p>${text}</p>`,
    });

    logger.info(`Email sent to user ${userId}`);
  } catch (error) {
    logger.error('Error sending email notification:', error);
    throw error;
  }
};

const sendPushNotification = async (userId, title, body) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      throw new Error('User not found or FCM token not available');
    }

    const message = {
      notification: { title, body },
      token: user.fcmToken,
    };

    await admin.messaging().send(message);
    logger.info(`Push notification sent to user ${userId}`);
  } catch (error) {
    logger.error('Error sending push notification:', error);
    throw error;
  }
};

const REWARDS = {
  DAILY_LOGIN: { points: 5, message: 'Daily login bonus' },
  STORY_COMPLETION: { points: 50, message: 'Story completed' },
  WRITING_STREAK: { points: 10, message: 'Writing streak maintained' },
};

const awardPoints = async (userId, rewardType) => {
  const reward = REWARDS[rewardType];
  if (!reward) {
    throw new Error('Invalid reward type');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { 'rewards.points': reward.points } },
    { new: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  await sendPushNotification(
    userId,
    'Reward Earned!',
    `You've earned ${reward.points} points for: ${reward.message}`
  );

  logger.info(`Awarded ${reward.points} points to user ${userId} for ${rewardType}`);
  return user.rewards;
};

const checkAndAwardBadge = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const totalPoints = user.rewards.points;
  let newBadge = null;

  if (totalPoints >= 1000 && !user.rewards.badges.includes('Master Writer')) {
    newBadge = 'Master Writer';
  } else if (totalPoints >= 500 && !user.rewards.badges.includes('Prolific Author')) {
    newBadge = 'Prolific Author';
  } else if (totalPoints >= 100 && !user.rewards.badges.includes('Aspiring Novelist')) {
    newBadge = 'Aspiring Novelist';
  }

  if (newBadge) {
    user.rewards.badges.push(newBadge);
    await user.save();

    await sendPushNotification(
      userId,
      'New Badge Earned!',
      `Congratulations! You've earned the "${newBadge}" badge.`
    );

    logger.info(`Awarded "${newBadge}" badge to user ${userId}`);
  }

  return user.rewards;
};

const getUserRewards = async (userId) => {
  const user = await User.findById(userId).select('rewards');
  if (!user) {
    throw new Error('User not found');
  }
  return user.rewards;
};

module.exports = {
  subscribeToNotifications,
  sendEmailNotification,
  sendPushNotification,
  notifyInactiveUsers,
  awardPoints,
  checkAndAwardBadge,
  getUserRewards,
};