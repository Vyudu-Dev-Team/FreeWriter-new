import express from 'express';
import { getStoryPrompt, getStoryGuidance, submitFeedback } from '../controllers/aiController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware); // Protect all AI routes

router.post('/prompt', getStoryPrompt);
router.post('/guidance', getStoryGuidance);
router.post('/feedback', submitFeedback);

export default router;