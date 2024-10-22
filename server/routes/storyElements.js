import express from 'express';
import StoryElement from '../models/StoryElement.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all story elements
router.get('/', auth, async (req, res) => {
  try {
    const elements = await StoryElement.find({ user: req.user.id }).sort('order');
    res.json(elements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new story element
router.post('/', auth, async (req, res) => {
  const element = new StoryElement({
    content: req.body.content,
    user: req.user.id,
    order: await StoryElement.countDocuments({ user: req.user.id })
  });

  try {
    const newElement = await element.save();
    res.status(201).json(newElement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update element order
router.put('/reorder', auth, async (req, res) => {
  try {
    const { elements } = req.body;
    for (let i = 0; i < elements.length; i++) {
      await StoryElement.findByIdAndUpdate(elements[i].id, { order: i });
    }
    res.json({ message: 'Element order updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;