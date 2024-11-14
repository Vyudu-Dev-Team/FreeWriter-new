import express from 'express';
import { body } from 'express-validator'; 
import authMiddleware from '../middleware/auth.js'; 
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  logoutUser,
  verifyEmail,
  sendVerificationToken,
  updateUserPreferences,
  getUserPreferences,
  resetUserPreferences,
} from '../controllers/userController.js'; 

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
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, [
  body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('writingMode').optional().isIn(['plotter', 'pantser']).withMessage('Invalid writing mode'),
  body('goals').optional().isArray().withMessage('Goals must be an array'),
  body('goals.*').isIn(['daily_writing', 'finish_novel', 'improve_skills', 'publish_book', 'other']).withMessage('Invalid goal'),
], updateUserProfile);


router.put('/preferences', authMiddleware, updateUserPreferences);
router.get('/preferences', authMiddleware, getUserPreferences);
router.post('/logout', authMiddleware, logoutUser);

export default router;