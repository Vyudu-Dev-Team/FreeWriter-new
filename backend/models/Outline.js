const mongoose = require( 'mongoose');
const { v4 : uuidv4 } = require( 'uuid');

// Declare the schema first
const sectionSchema = new mongoose.Schema({
  id: { 
    type: String, 
    default: uuidv4,
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    default: '' 
  },
  children: [mongoose.Schema.Types.Mixed] // Use Mixed type for recursive structure
}, { _id: false }); 

// Add children recursively after schema declaration
sectionSchema.add({
  children: [sectionSchema]
});

const outlineSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['plotter', 'pantser'], 
    default: 'plotter' 
  },
  sections: [sectionSchema],
}, { 
  timestamps: true,
  strict: true 
});

const Outline = mongoose.model('Outline', outlineSchema);

module.exports =   Outline;