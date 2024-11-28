import connectDB from '../config/database.js';
import Card from '../models/Card.js';
import { generateCard } from '../services/cardGenerationService.js';
import { errorHandler } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Generates a new card and stores it in the database.
 * @param {Object} event - The Netlify function event object.
 * @param {Object} context - The Netlify function context object.
 * @returns {Object} The generated card or an error response.
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const { userId, cardType } = JSON.parse(event.body);

    const newCard = await generateCard(userId, cardType);
    const savedCard = await Card.create(newCard);

    logger.info(`Card generated for user ${userId}`, { cardId: savedCard._id });

    return {
      statusCode: 201,
      body: JSON.stringify(savedCard)
    };
  } catch (error) {
    logger.error('Error in card generation', { error: error.message });
    return errorHandler(error);
  }
};