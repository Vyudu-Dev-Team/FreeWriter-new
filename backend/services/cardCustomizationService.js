import { validateCustomization, validateRarity } from '../utils/validators.js';

/**
 * Customizes a card with user-defined attributes.
 * @param {Object} card - The card to customize.
 * @param {Object} customization - The customization options.
 * @returns {Object} The customized card.
 */
export const customizeCard = async (card, customization) => {
  validateCustomization(customization);
  card.customization = { ...card.customization, ...customization };
  return card;
};

/**
 * Sets the rarity of a card.
 * @param {Object} card - The card to modify.
 * @param {string} rarity - The new rarity level.
 * @returns {Object} The updated card.
 */
export const setCardRarity = async (card, rarity) => {
  validateRarity(rarity);
  card.rarity = rarity;
  return card;
};