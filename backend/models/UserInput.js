// backend/models/UserInput.js
import mongoose from 'mongoose';

const userInputSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  inputText: {
    type: String,
    required: true,
  },
  genre: {
    type: String, // e.g., 'mystery', 'fantasy', 'romance'
    required: false,
  },
  preferences: {
    type: Map, // Map to store user-defined preferences for prompt generation
    of: String,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('UserInput', userInputSchema);
