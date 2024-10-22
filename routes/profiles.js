import express from 'express';
import Profile from '../models/Profile.js';
import auth from '../middleware/auth.js';
import { generateAIOnboarding } from '../services/aiService.js';

const router = express.Router();

// @route   POST api/profiles
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
  const { username, avatar, bio, writingMode } = req.body;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { username, avatar, bio, writingMode } },
        { new: true }
      );
    } else {
      // Create
      profile = new Profile({
        user: req.user.id,
        username,
        avatar,
        bio,
        writingMode
      });

      await profile.save();
    }

    // Generate AI onboarding based on writing mode
    const onboardingPrompt = await generateAIOnboarding(writingMode);

    res.json({ profile, onboardingPrompt });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;