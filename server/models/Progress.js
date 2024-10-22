import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  goal: {
    type: Number,
    default: 50000
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Progress', ProgressSchema);