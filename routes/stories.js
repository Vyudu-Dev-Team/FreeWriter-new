import express from 'express';
import Story from '../models/Story.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/stories
// @desc    Create a new story
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newStory = new Story({
      user: req.user.id,
      title: req.body.title,
      content: req.body.content,
      cards: req.body.cards
    });

    const story = await newStory.save();
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/stories
// @desc    Get all stories for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// TODO: Add routes for updating and deleting stories

export default router;