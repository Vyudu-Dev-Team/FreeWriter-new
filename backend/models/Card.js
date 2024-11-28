import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['character', 'plot', 'setting', 'theme']
  },
  content: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'legendary'],
    default: 'common'
  },
  customization: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Card = mongoose.model('Card', cardSchema);

export default Card;