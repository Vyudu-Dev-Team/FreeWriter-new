import express from 'express';
import auth from '../middleware/auth.js';
import logger from '../middleware/errorHandler.js';
import { generatePrompt, generateFeedback, processUserInput, generateCardArtwork } from '../services/aiService.js';
import { saveAndProcessInput } from '../controllers/aiController.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST api/ai/prompt
// @desc    Generate a writing prompt
// @access  Private
router.post('/prompt', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const prompt = await generatePrompt(user, user.writingMode);
    res.json({ prompt });
  } catch (err) {
    logger.error(`Error generating prompt: ${err.message}`);
    next(err);
  }
});

// @route   POST api/ai/process-input
// @desc    Store and process user input for prompt generation
// @access  Private
router.post('/process-input', auth, async (req, res, next) => {
  try {
    await saveAndProcessInput(req, res);
  } catch (err) {
    logger.error(`Error processing user input: ${err.message}`);
    next(err);
  }
});

// Additional routes can be included here, similar to error handling for generateFeedback and generateCardArtwork

export default router;