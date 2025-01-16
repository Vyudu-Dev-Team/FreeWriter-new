const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  history: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  last_update: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversation', conversationSchema); 