// backend/models/Profile.js
// This model will store user profile data such as goals and preferences. It will have a reference to the User model to establish a one-to-one relationship between the two models.

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goals: {
    type: [String], // Array of goals for flexibility
    default: [],
  },
  preferences: {
    type: Map,
    of: String, // Map to store key-value pairs of preferences
    default: {},
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);
