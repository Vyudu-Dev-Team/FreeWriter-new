import express from 'express';
import auth from '../middleware/auth.js';
import { generatePrompt, generateFeedback, processUserInput, generateCardArtwork } from '../services/aiService.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST api/ai/prompt
// @desc    Generate a writing prompt
// @access  Private
router.post('/prompt', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const prompt = await generatePrompt(user, user.writingMode);
    res.json({ prompt });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/feedback
// @desc    Get AI feedback on writing
// @access  Private
router.post('/feedback', auth, async (req, res) => {
  const { content } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const feedback = await generateFeedback(content, user.writingMode);
    res.json({ feedback });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/process-input
// @desc    Process user input for story assistance
// @access  Private
router.post('/process-input', auth, async (req, res) => {
  const { input, context } = req.body;
  try {
    const suggestion = await processUserInput(input, context);
    res.json({ suggestion });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ai/generate-artwork
// @desc    Generate artwork for a card
// @access  Private
router.post('/generate-artwork', auth, async (req, res) => {
  const { cardType, description } = req.body;
  try {
    const artworkUrl = await generateCardArtwork(cardType, description);
    res.json({ artworkUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;