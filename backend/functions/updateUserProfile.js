const connectDB = require( '../config/database.js');
const User = require( '../models/User.js');
const Profile = require( '../models/Profile.js');
const { verifyToken } = require( '../utils/jwt.js');
const { errorHandler } = require( '../utils/errorHandler.js');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    if (event.httpMethod !== 'PUT') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Not authorized' }) };
    }

    const decoded = verifyToken(token);
    const { username, bio, avatar, writingMode, goals } = JSON.parse(event.body);

    const user = await User.findById(decoded.id);
    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.id !== decoded.id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Username already exists' }) };
      }
      user.username = username;
    }

    if (writingMode) user.writingMode = writingMode;
    if (goals) user.goals = goals;

    await user.save();

    const profile = await Profile.findOneAndUpdate(
      { user: decoded.id },
      { bio, avatar },
      { new: true, runValidators: true }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ user, profile })
    };
  } catch (error) {
    return errorHandler(error);
  }
};

module.exports = {
  handler
};