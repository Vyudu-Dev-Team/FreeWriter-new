import express from 'express';
import Feedback from '../models/Feedback.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const newFeedback = new Feedback({
      user: req.user.id,
      content: req.body.feedback
    });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

export default router;