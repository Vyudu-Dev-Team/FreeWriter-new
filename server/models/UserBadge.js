import mongoose from 'mongoose';

const UserBadgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true
  },
  awardedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('UserBadge', UserBadgeSchema);