import connectDB from '../config/database.js';
import Card from '../models/Card.js';
import { customizeCard, setCardRarity } from '../services/cardCustomizationService.js';
import { errorHandler } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Handles card customization and rarity setting.
 * @param {Object} event - The Netlify function event object.
 * @param {Object} context - The Netlify function context object.
 * @returns {Object} The customized card or an error response.
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();

    if (event.httpMethod !== 'PUT') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const { userId, cardId, customization, rarity } = JSON.parse(event.body);

    let updatedCard = await Card.findById(cardId);

    if (customization) {
      updatedCard = await customizeCard(updatedCard, customization);
    }

    if (rarity) {
      updatedCard = await setCardRarity(updatedCard, rarity);
    }

    await updatedCard.save();

    logger.info(`Card customized for user ${userId}`, { cardId });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedCard)
    };
  } catch (error) {
    logger.error('Error in card customization', { error: error.message });
    return errorHandler(error);
  }
};