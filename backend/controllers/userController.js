import crypto from 'crypto';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

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

export const registerUser = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure user data from request body
    const { username, email, password, writingMode } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('Email or username already exists', 400));
    }

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
      writingMode,
    });

    // Create a profile for the new user
    await Profile.create({ user: newUser._id });

    // Send token and response
    createSendToken(newUser, 201, res);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile= async (req, res, next) => {
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

export const updateUserProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;

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
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};




//Emails verfication and auth logics:

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



export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Hash token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Log user in
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
