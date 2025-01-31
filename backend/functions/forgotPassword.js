const connectDB = require( '../config/database.js');
const User = require( '../models/User.js');
const { sendPasswordResetEmail } = require( '../utils/sendEmail.js');
const { errorHandler } = require( '../utils/errorHandler.js');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { email } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, resetToken);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Password reset email sent!' })
      };
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return { statusCode: 500, body: JSON.stringify({ message: 'Error sending email. Please try again.' }) };
    }
  } catch (error) {
    return errorHandler(error);
  }
};

module.exports = {
  handler
};