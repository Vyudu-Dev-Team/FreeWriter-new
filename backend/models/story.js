const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    enum: [
      'Fantasy', 
      'Science Fiction', 
      'Mystery', 
      'Romance', 
      'Historical Fiction', 
      'Horror', 
      'Thriller', 
      'Adventure', 
      'General'
    ],
    default: 'General'
  },
  status: {
    type: String,
    enum: ['Draft', 'In Progress', 'Completed', 'Abandoned'],
    default: 'Draft'
  },
  wordCount: {
    type: Number,
    default: 0
  },
  complexity: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  targetAudience: {
    type: String,
    enum: ['Children', 'Young Adults', 'Adults', 'All Ages'],
    default: 'All Ages'
  },
  writingStyle: {
    type: String,
    enum: ['Descriptive', 'Minimalist', 'Narrative', 'Experimental'],
    default: 'Narrative'
  },
  integratedCards: {
    type: [String], 
    default: []
  },
  tags: [{
    type: String,
    trim: true
  }],
  prompt: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to update word count
StorySchema.pre('save', function(next) {
  this.wordCount = this.content ? this.content.trim().split(/\s+/).length : 0;
  this.updatedAt = Date.now();
  next();
});

// Virtual for reading time
StorySchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  return Math.ceil(this.wordCount / wordsPerMinute);
});

// Method to update story status based on word count or completion
StorySchema.methods.updateStatus = function() {
  if (this.wordCount > 50000) {
    this.status = 'Completed';
  } else if (this.wordCount > 0) {
    this.status = 'In Progress';
  }
};

// Static method to find stories by genre
StorySchema.statics.findByGenre = function(genre) {
  return this.find({ genre: genre });
};

const Story = mongoose.model('Story', StorySchema);

export default Story;