import express from 'express';
import { body } from 'express-validator';
import {
  sendVerificationToken,
  verifyEmail
} from '../controllers/authController.js';
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import {
  getPreferences,
  updatePreferences,
} from '../services/preferencesService.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);




router.post('/verify-email/send', sendVerificationToken);
router.get('/verify-email/:token', verifyEmail);

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/preferences', authMiddleware, updatePreferences);
router.get('/preferences', authMiddleware, getPreferences);

export default router;