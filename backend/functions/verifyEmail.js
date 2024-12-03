import connectDB from "../config/database.js";
import User from "../models/User.js";
import { generateToken as createToken } from "../utils/jwt.js";
import { errorHandler } from "../utils/errorHandler.js";
import crypto from "crypto";

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
      await connectDB();

      if (event.httpMethod !== 'POST') {
          return { statusCode: 405, body: 'Method Not Allowed' };
      }

      const { token } = JSON.parse(event.body);
      console.log('Received Verification Token:', token); // Log the received token

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      console.log('Hashed Token for Verification:', hashedToken); // Log the hashed token

      const user = await User.findOne({
          emailVerificationToken: hashedToken,
          emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
          return { statusCode: 400, body: JSON.stringify({ message: 'Token is invalid or has expired' }) };
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      const jwtToken = createToken(user._id);

      return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Email verified successfully', token: jwtToken })
      };
  } catch (error) {
      console.error('Verification error:', error);
      return errorHandler(error);
  }
};
