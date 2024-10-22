import express from 'express';
import auth from '../middleware/auth.js';
import UserBadge from '../models/UserBadge.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user: req.user.id }).populate('badge');
    res.json(userBadges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;