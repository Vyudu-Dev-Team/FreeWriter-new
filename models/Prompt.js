import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Prompt content is required'],
    trim: true,
    maxlength: [500, 'Prompt content cannot be more than 500 characters']
  },
  category: {
    type: String,
    enum: ['character', 'setting', 'conflict', 'theme'],
    required: [true, 'Prompt category is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Prompt', PromptSchema);