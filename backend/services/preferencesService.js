import User from '../models/User.js';

export const updatePreferences = async (userId, preferences) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences: preferences } },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return { success: true, preferences: updatedUser.preferences };
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

export const getPreferences= async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
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
