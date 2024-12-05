import mongoose from 'mongoose';

const writingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  wordCount: { type: Number, default: 0 },
  lastSaved: { type: Date, default: Date.now },
}, { timestamps: true });

const WritingSession = mongoose.model('WritingSession', writingSessionSchema);

export default WritingSession;