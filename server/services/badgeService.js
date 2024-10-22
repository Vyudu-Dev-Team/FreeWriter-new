import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';
import { sendNotification } from './notificationService.js';

export const checkAndAwardBadges = async (userId) => {
  const badges = await Badge.find();
  const userBadges = await UserBadge.find({ user: userId });

  for (const badge of badges) {
    if (!userBadges.some(ub => ub.badge.toString() === badge._id.toString())) {
      const shouldAward = await evaluateBadgeCriteria(userId, badge.criteria);
      if (shouldAward) {
        await awardBadge(userId, badge._id);
      }
    }
  }
};

const evaluateBadgeCriteria = async (userId, criteria) => {
  // Implement logic to evaluate badge criteria
  // This will depend on your specific badge requirements
  return true; // Placeholder
};

const awardBadge = async (userId, badgeId) => {
  const userBadge = new UserBadge({
    user: userId,
    badge: badgeId
  });
  await userBadge.save();

  const badge = await Badge.findById(badgeId);
  await sendNotification(userId, 'email', `Congratulations! You've earned the ${badge.name} badge!`);
};