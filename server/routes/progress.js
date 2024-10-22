import express from 'express';
import Progress from '../models/Progress.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's progress
router.get('/', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });
    if (!progress) {
      progress = new Progress({ user: req.user.id, progress: 0, goal: 50000 });
      await progress.save();
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user's progress
router.put('/', auth, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id },
      { $set: { progress: req.body.progress } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;