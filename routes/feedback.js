import express from 'express';
import auth from '../middleware/auth.js';
import { generateFeedback } from '../services/aiService.js';

const router = express.Router();

// @route   POST api/feedback
// @desc    Get AI feedback on writing
// @access  Private
router.post('/', auth, async (req, res) => {
  const { content } = req.body;

  try {
    const feedback = await generateFeedback(content);
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;