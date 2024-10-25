import mongoose from 'mongoose';
import { db } from '../services/firebaseService';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  writingMode: { type: String, enum: ['plotter', 'pantser'], default: 'plotter' },
  preferences: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

userSchema.post('save', function(doc) {
  // Sync user data to Firebase
  const userRef = db.ref(`users/${doc._id.toString()}`);
  userRef.set({
    username: doc.username,
    email: doc.email,
    writingMode: doc.writingMode,
    preferences: doc.preferences,
    createdAt: doc.createdAt.toISOString()
  });
});

const User = mongoose.model('User', userSchema);

export default User;