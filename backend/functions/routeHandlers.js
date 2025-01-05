const User = require("../models/User.js");
const Story = require("../models/story.js");
const Profile = require('../models/Profile.js');
const crypto = require("crypto");
const { verifyToken, generateToken, verifyEmailToken } = require("../utils/jwt.js");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/sendEmail.js");
const {
  updatePreferences,
  getPreferences,
  resetPreferences,
} = require("../services/preferencesService.js");

const {
  validateCardType,
  validateCustomization,
  validateRarity,
  validateDeckOperation,
  validateStoryIntegration
} = require("../utils/validators.js");

const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError.js");
const OpenAI = require('openai');
const logger = require('../utils/logger.js');
