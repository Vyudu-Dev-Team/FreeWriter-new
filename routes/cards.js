import express from 'express';
import Card from '../models/Card.js';
import auth from '../middleware/auth.js';
import { generateCardArtwork } from '../services/aiService.js';

const router = express.Router();

// @route   POST api/cards
// @desc    Create a new card
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, name, description, customFields } = req.body;

    const newCard = new Card({
      user: req.user.id,
      type,
      name,
      description,
      customFields
    });

    // Generate artwork for the card
    const artworkUrl = await generateCardArtwork(type, description);
    newCard.artworkUrl = artworkUrl;

    const card = await newCard.save();
    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/cards
// @desc    Get all cards for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/cards/:id
// @desc    Update a card
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, customFields } = req.body;
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    // Check user
    if (card.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    card.name = name || card.name;
    card.description = description || card.description;
    card.customFields = customFields || card.customFields;
    card.updatedAt = Date.now();

    await card.save();
    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cards/:id
// @desc    Delete a card
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    // Check user
    if (card.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await card.remove();
    res.json({ msg: 'Card removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;