import express from 'express';
import OutlineItem from '../models/OutlineItem.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all outline items
router.get('/', auth, async (req, res) => {
  try {
    const items = await OutlineItem.find({ user: req.user.id }).sort('createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new outline item
router.post('/', auth, async (req, res) => {
  const item = new OutlineItem({
    content: req.body.content,
    user: req.user.id
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an outline item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await OutlineItem.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ message: 'Outline item not found' });
    }
    await item.remove();
    res.json({ message: 'Outline item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;