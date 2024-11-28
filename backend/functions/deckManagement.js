import connectDB from '../config/database.js';
import Deck from '../models/Deck.js';
import { viewDeck, editDeck, organizeDeck } from '../services/deckManagementService.js';
import { errorHandler } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Manages user decks (viewing, editing, and organizing).
 * @param {Object} event - The Netlify function event object.
 * @param {Object} context - The Netlify function context object.
 * @returns {Object} The result of the deck operation or an error response.
 */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();

    const { userId, action, deckId } = JSON.parse(event.body);

    let result;
    switch (action) {
      case 'view':
        result = await viewDeck(userId, deckId);
        break;
      case 'edit':
        result = await editDeck(userId, deckId, event.body);
        break;
      case 'organize':
        result = await organizeDeck(userId, deckId, event.body);
        break;
      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
    }

    logger.info(`Deck ${action} performed for user ${userId}`, { deckId });

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error in deck management', { error: error.message });
    return errorHandler(error);
  }
};