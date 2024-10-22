import express from 'express';
import auth from '../middleware/auth.js';
import { generateSketch, improveSketch } from '../services/aiService.js';

const router = express.Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const sketchUrl = await generateSketch(req.body.description);
    res.json({ sketchUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/improve', auth, async (req, res) => {
  try {
    const improvedSketchUrl = await improveSketch(req.body.sketchUrl, req.body.feedback);
    res.json({ improvedSketchUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;