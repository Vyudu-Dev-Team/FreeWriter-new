const { generateStoryPrompt } = require( '../services/aiService.js');
const AppError = require( '../utils/appError.js');

const handler = async (event) => {
  try {
    const { genre, writingStyle, complexity, targetAudience } = JSON.parse(event.body);

    if (!genre || !writingStyle || !complexity || !targetAudience) {
      throw new AppError('Missing required parameters', 400);
    }

    const prompt = await generateStoryPrompt({ genre, writingStyle, complexity, targetAudience });

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        data: { prompt }
      })
    };
  } catch (error) {
    console.error('Error in getStoryPrompt:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        status: 'error',
        message: error.message || 'An error occurred while generating the story prompt'
      })
    };
  }
};

module.exports = {
  handler
};