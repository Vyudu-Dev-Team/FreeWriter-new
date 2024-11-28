import connectDB from '../config/database.js';
import Story from '../models/story.js';
import { integrateCardIntoStory } from '../services/storyIntegrationService.js';
import { errorHandler } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Integrates a card into a user's story.
 * @param {Object} event - The Netlify function event object.
 * @param {Object} context - The Netlify function context object.
 * @returns {Object} The updated story or an error response.
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const { userId, storyId, cardId } = JSON.parse(event.body);

    const updatedStory = await integrateCardIntoStory(userId, storyId, cardId);

    logger.info(`Card integrated into story for user ${userId}`, { storyId, cardId });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedStory)
    };
  } catch (error) {
    logger.error('Error in story integration', { error: error.message });
    return errorHandler(error);
  }
};