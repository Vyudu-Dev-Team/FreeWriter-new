const mongoose = require( 'mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  promptId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports =   mongoose.model('Feedback', FeedbackSchema);