import express from 'express';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import auth from '../middleware/auth.js';

const router = express.Router();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  maxOutputTokens: 2048
});

// @route   POST api/prompts/generate
// @desc    Generate a new prompt using AI
// @access  Private
router.post('/generate', auth, async (req, res) => {
  const { userInput } = req.body;

  try {
    const response = await model.invoke(userInput);
    res.json({ prompt: response.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;