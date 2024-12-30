const connectDB = require( '../config/database.js');
  const User = require( '../models/User.js');
  const { generateToken : createToken } = require( '../utils/jwt.js');
  const { errorHandler } = require( '../utils/errorHandler.js');
  const crypto = require( 'crypto');

const handler = async (event, context) => {
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

module.exports = {
  handler
};