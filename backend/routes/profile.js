// backend/routes/profile.js
// This file will contain the routes for creating and updating user profiles. It will also have a route to retrieve a user's profile by their user ID.
const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// GET profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create or update profile
router.post('/:userId', async (req, res) => {
  try {
    const { goals, preferences } = req.body;
    let profile = await Profile.findOne({ userId: req.params.userId });
    if (profile) {
      // Update profile if it exists
      profile.goals = goals || profile.goals;
      profile.preferences = preferences || profile.preferences;
    } else {
      // Create a new profile
      profile = new Profile({
        userId: req.params.userId,
        goals,
        preferences,
      });
    }
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
