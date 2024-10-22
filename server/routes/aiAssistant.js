import express from 'express';
import { generateAIResponse } from '../services/aiService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const response = await generateAIResponse(req.body.input);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;