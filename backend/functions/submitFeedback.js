const { verifyToken } = require( '../utils/jwt.js');
const Feedback = require( '../models/Feedback.js');
const AppError = require( '../utils/appError.js');

const handler = async (event) => {
  try {
    const userId = await verifyToken(event);
    const { promptId, rating, comments } = JSON.parse(event.body);

    if (!promptId || !rating) {
      throw new AppError('Missing required parameters', 400);
    }

    const feedback = await Feedback.create({
      user: userId,
      promptId,
      rating,
      comments
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        status: 'success',
        data: { feedback }
      })
    };
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        status: 'error',
        message: error.message || 'An error occurred while submitting feedback'
      })
    };
  }
};

module.exports = {
  handler
};