import mongoose from 'mongoose';

const SceneSequelSchema = new mongoose.Schema({
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  sceneGoal: String,
  conflict: String,
  disaster: String,
  reaction: String,
  dilemma: String,
  decision: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SceneSequel', SceneSequelSchema);