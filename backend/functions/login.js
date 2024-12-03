import connectDB from '../config/database.js';
import User from '../models/User.js';
import { generateToken as createToken } from '../utils/jwt.js';;
import { errorHandler } from '../utils/errorHandler.js';

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { email, password } = JSON.parse(event.body);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Incorrect email or password' }) };
    }

    const token = createToken(user._id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        token,
        user: { id: user._id, username: user.username, email: user.email }
      })
    };
  } catch (error) {
    return errorHandler(error);
  }
};