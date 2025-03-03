const mongoose = require( 'mongoose');

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['CHARACTER', 'WORLD', 'CONFLICT']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: '/assets/images/default-card.svg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Card = mongoose.model('Card', cardSchema);

module.exports =   Card;