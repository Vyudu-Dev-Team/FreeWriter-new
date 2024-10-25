import { db } from './firebaseServices.js'; 
import User from '../models/User.js'; 
export const updatePreferences = async (userId, preferences) => {
  try {
    // Update MongoDB
    await User.findByIdAndUpdate(userId, { preferences });

    // Update Firebase
    const userRef = db.ref(`users/${userId}`);
    await userRef.update({ preferences });

    return { success: true };
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

export const getPreferences = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.preferences;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
};

export const subscribeToPreferences = (userId, callback) => {
  const userRef = db.ref(`users/${userId}/preferences`);
  userRef.on('value', (snapshot) => {
    callback(snapshot.val());
  });
};