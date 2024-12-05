import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['character', 'plot', 'setting', 'chapter', 'scene'],  // Add 'chapter' and 'scene' to the enum
    required: true 
  },
  content: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
});

const storyMapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  elements: [
    {
      type: { 
        type: String, 
        enum: ['character', 'plot', 'setting', 'chapter', 'scene'],  // Add 'chapter' and 'scene' to the enum
        required: true 
      },
      title: { type: String, required: true },
    }
  ],
}, { timestamps: true });

const StoryMap = mongoose.model('StoryMap', storyMapSchema);

export default StoryMap;
