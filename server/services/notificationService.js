import Notification from '../models/Notification.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import webpush from 'web-push';

const transporter = nodemailer.createTransport({
  // Configure email transport
});

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendNotification = async (userId, type, content) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const notification = new Notification({
    user: userId,
    type,
    content
  });
  await notification.save();

  if (type === 'email') {
    await transporter.sendMail({
      from: 'noreply@freewriter.com',
      to: user.email,
      subject: 'New Notification from freeWriter',
      text: content
    });
  } else if (type === 'push') {
    // Implement push notification logic
  }
};

export const getUnreadNotifications = async (userId) => {
  return Notification.find({ user: userId, read: false }).sort('-createdAt');
};

export const markNotificationAsRead = async (notificationId) => {
  await Notification.findByIdAndUpdate(notificationId, { read: true });
};