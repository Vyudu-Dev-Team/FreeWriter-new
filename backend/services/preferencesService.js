// services/preferencesService.js
import User from "../models/User.js";
import AppError from "../utils/appError.js";

/**
 * Preference categories
 * @enum {string}
 */
const PreferenceCategory = {
  INTERFACE: "interface",
  WRITING: "writing",
  NOTIFICATIONS: "notifications",
  PRIVACY: "privacy",
};

/**
 * Default preferences
 * @type {Object}
 */
const DEFAULT_PREFERENCES = {
  [PreferenceCategory.INTERFACE]: {
    theme: "light",
    fontSize: 16,
    fontFamily: "Arial",
  },
  [PreferenceCategory.WRITING]: {
    autoSave: true,
    spellCheck: true,
    wordCountGoal: 500,
  },
  [PreferenceCategory.NOTIFICATIONS]: {
    emailNotifications: true,
    pushNotifications: false,
  },
  [PreferenceCategory.PRIVACY]: {
    shareProgress: false,
    publicProfile: true,
  },
};

/**
 * Get user preferences
 * @param {string} userId - User ID
 * @returns {Object} User preferences
 */
export const getPreferences = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Merge user preferences with default preferences
  return {
    ...DEFAULT_PREFERENCES,
    ...user.preferences,
  };
};

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} newPreferences - New user preferences
 * @returns {Object} Updated preferences
 */
export const updatePreferences = async (userId, newPreferences) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Validate and sanitize new preferences
  const validatedPreferences = validateAndSanitizePreferences(newPreferences);

  // Merge new preferences with existing preferences
  user.preferences = {
    ...user.preferences,
    ...validatedPreferences,
  };

  await user.save();

  return getPreferences(userId);
};

/**
 * Reset user preferences to default
 * @param {string} userId - User ID
 * @returns {Object} Default preferences
 */
export const resetPreferences = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Reset preferences to default values
  user.preferences = DEFAULT_PREFERENCES; // Set to default preferences
  await user.save();

  return DEFAULT_PREFERENCES; // Return the default preferences
};

/**
 * Validate and sanitize preferences
 * @param {Object} preferences - Preferences to validate
 * @returns {Object} Validated and sanitized preferences
 */
const validateAndSanitizePreferences = (preferences) => {
  const validatedPreferences = {};

  for (const [category, values] of Object.entries(preferences)) {
    if (PreferenceCategory[category.toUpperCase()]) {
      validatedPreferences[category] = {};
      for (const [key, value] of Object.entries(values)) {
        if (
          DEFAULT_PREFERENCES[category] &&
          DEFAULT_PREFERENCES[category].hasOwnProperty(key)
        ) {
          validatedPreferences[category][key] = sanitizePreferenceValue(
            value,
            typeof DEFAULT_PREFERENCES[category][key]
          );
        }
      }
    }
  }

  return validatedPreferences;
};

/**
 * Sanitize preference value
 * @param {*} value - Value to sanitize
 * @param {string} expectedType - Expected type of the value
 * @returns {*} Sanitized value
 */
const sanitizePreferenceValue = (value, expectedType) => {
  switch (expectedType) {
    case "boolean":
      return Boolean(value);
    case "number":
      return Number(value) || 0;
    case "string":
      return String(value).slice(0, 255); // Limit string length
    default:
      return value;
  }
};
