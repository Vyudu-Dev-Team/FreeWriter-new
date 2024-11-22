import connectDB from '../config/database.js';
import User from '../models/User.js';
import { generateToken as createToken } from '../utils/jwt.js';;
import { errorHandler } from '../utils/errorHandler.js';
import crypto from 'crypto';

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { token, password } = JSON.parse(event.body);

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Token is invalid or has expired' }) };
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const jwtToken = createToken(user._id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password reset successful', token: jwtToken })
    };
  } catch (error) {
    return errorHandler(error);
  }
};