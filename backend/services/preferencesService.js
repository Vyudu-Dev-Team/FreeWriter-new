import { db } from './firebaseService';
import User from '../models/User';

export const updatePreferences = async (userId, preferences) => {
  // Update MongoDB
  await User.findByIdAndUpdate(userId, { preferences });

  // Update Firebase
  const userRef = db.ref(`users/${userId}`);
  await userRef.update({ preferences });
};

export const getPreferences = async (userId) => {
  const user = await User.findById(userId);
  return user.preferences;
};

export const subscribeToPreferences = (userId, callback) => {
  const userRef = db.ref(`users/${userId}/preferences`);
  userRef.on('value', (snapshot) => {
    callback(snapshot.val());
  });
};