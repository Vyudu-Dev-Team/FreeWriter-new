import Deck from '../models/Deck.js';
import { validateDeckOperation } from '../utils/validators.js';

/**
 * Retrieves a user's deck.
 * @param {string} userId - The ID of the user.
 * @param {string} deckId - The ID of the deck to view.
 * @returns {Object} The requested deck.
 */
export const viewDeck = async (userId, deckId) => {
  validateDeckOperation(userId, deckId, 'view');
  return await Deck.findOne({ _id: deckId, userId }).populate('cards');
};

/**
 * Edits a user's deck.
 * @param {string} userId - The ID of the user.
 * @param {string} deckId - The ID of the deck to edit.
 * @param {Object} updates - The updates to apply to the deck.
 * @returns {Object} The updated deck.
 */
export const editDeck = async (userId, deckId, updates) => {
  validateDeckOperation(userId, deckId, 'edit');
  return await Deck.findOneAndUpdate({ _id: deckId, userId }, updates, { new: true });
};

/**
 * Organizes cards within a user's deck.
 * @param {string} userId - The ID of the user.
 * @param {string} deckId - The ID of the deck to organize.
 * @param {Array} cardOrder - The new order of card IDs.
 * @returns {Object} The reorganized deck.
 */
export const organizeDeck = async (userId, deckId, cardOrder) => {
  validateDeckOperation(userId, deckId, 'organize');
  const deck = await Deck.findOne({ _id: deckId, userId });
  deck.cards = cardOrder;
  return await deck.save();
};
