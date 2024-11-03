import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import Profile from '../models/Profile.js'; 
import { errorHandler, notFound } from '../middleware/errorMiddleware.js';
import AppError from '../utils/appError.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/sendEmail.js';
import sendEmail from '../utils/sendEmail.js'; 
import { updatePreferences, getPreferences } from '../services/preferencesService.js';
import crypto from 'crypto';

/**
 * Generate a JWT token for a user
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

/**
 * Create and send a JWT token
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000 // Default to 90 days if not set
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, writingMode } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('Email or username already exists', 400));
    }

    const newUser = await User.create({
      username,
      email,
      password,
      writingMode,
    });

    await Profile.create({ user: newUser._id });

    // Generate verification token
    const verificationToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await sendVerificationEmail(newUser, verificationToken);

      res.status(201).json({
        status: 'success',
        message: 'User created. Please check your email to verify your account.',
      });
    } catch (err) {
      newUser.emailVerificationToken = undefined;
      newUser.emailVerificationExpires = undefined;
      await newUser.save({ validateBeforeSave: false });

      return next(new AppError('There was an error sending the verification email. Please try again.', 500));
    }
  } catch (error) {
    next(error);
  }
};


/**
 * Log in a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user's email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const sendVerificationToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.isEmailVerified) {
      return next(new AppError('Email is already verified', 400));
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Save token to user
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationToken);

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent!'
      });
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError('There was an error sending the verification email. Try again later.', 500));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Log out a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logoutUser = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

/**
 * Forgot password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with that email address', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const message = `Your password reset token (valid for 10 min): ${resetToken}`;
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        text:message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
        email: user.email,
      });
    } catch (err) {
      console.error('Email sending error:', err);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(`There was an error sending the email: ${err.message}`, 500) // Include the error message
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });

    if (!user || !profile) {
      return next(new AppError('User or profile not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (req, res, next) => {
  const { username, bio, avatar, writingMode, goals } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (username) {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.id !== req.user.id) {
      return next(new AppError('Username already exists', 400));
    }
    user.username = username;
  }

  if (writingMode) user.writingMode = writingMode;
  if (goals) user.goals = goals;

  await user.save();

  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { bio, avatar },
    { new: true, runValidators: true }
  );

  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
      profile,
    },
  });
};

/**
 * Update user preferences
 * @route PUT /api/users/preferences
 * @access Private
 */
export const updateUserPreferences = async (req, res, next) => {
  const { preferences } = req.body;

  if (!preferences || typeof preferences !== 'object') {
    return next(new AppError('Invalid preferences data', 400));
  }

  const updatedPreferences = await updatePreferences(req.user.id, preferences);

  res.status(200).json({
    status: 'success',
    data: {
      preferences: updatedPreferences,
    },
  });
};

/**
 * Get user preferences
 * @route GET /api/users/preferences
 * @access Private
 */
export const getUserPreferences = async (req, res, next) => {
  const preferences = await getPreferences(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      preferences,
    },
  });
};

/**
 * Reset user preferences
 * @route POST /api/users/preferences/reset
 * @access Private
 */
export const resetUserPreferences = async (req, res, next) => {
  const defaultPreferences = await resetPreferences(req.user.id);

  res.status(200).json({
    status: 'success',
    message: 'Preferences reset to default',
    data: {
      preferences: defaultPreferences,
    },
  });
};
