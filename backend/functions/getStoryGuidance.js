import { generateStoryGuidance } from '../services/aiService.js';
import AppError from '../utils/appError.js';

export const handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      throw new AppError('Missing story prompt', 400);
    }

    const guidance = await generateStoryGuidance({ prompt });

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        data: { guidance }
      })
    };
  } catch (error) {
    console.error('Error in getStoryGuidance:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        status: 'error',
        message: error.message || 'An error occurred while generating story guidance'
      })
    };
  }
};