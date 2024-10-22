import express from 'express';
import { body, validationResult } from 'express-validator';
import Story from '../models/Story.js';
import auth from '../middleware/auth.js';
import logger from '../middleware/errorHandler.js';

const router = express.Router();

// @route   POST api/stories
// @desc    Create a new story
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('writingMode').optional().isIn(['Plotter', 'Pantser']).withMessage('Invalid writing mode')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newStory = new Story({
      user: req.user.id,
      title: req.body.title,
      content: '',
      writingMode: req.body.writingMode || 'Plotter'
    });

    const story = await newStory.save();
    res.json(story);
  } catch (err) {
    logger.error(`Error creating story: ${err.message}`);
    res.status(500).json({ message: 'Error creating story', error: err.message });
  }
});

// ... (other routes with similar input validation)

export default router;