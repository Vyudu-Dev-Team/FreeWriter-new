import express from 'express';
import auth from '../middleware/auth.js';
import { generatePrompt, generateFeedback, processUserInput, generateCardArtwork } from '../services/aiService.js';
import User from '../models/User.js';
import logger from '../middleware/errorHandler.js';

const router = express.Router();

// @route   POST api/ai/prompt
// @desc    Generate a writing prompt
// @access  Private
router.post('/prompt', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const prompt = await generatePrompt(user, user.writingMode);
    res.json({ prompt });
  } catch (err) {
    logger.error(`Error generating prompt: ${err.message}`);
    res.status(500).json({ message: 'Error generating prompt', error: err.message });
  }
});

// Similar error handling for other routes...

export default router;