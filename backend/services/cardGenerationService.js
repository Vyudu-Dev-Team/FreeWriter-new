import OpenAI from 'openai';
import { validateCardType } from '../utils/validators.js';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

/**
 * Generates a new card based on the user's preferences and card type.
 * @param {string} userId - The ID of the user generating the card.
 * @param {string} cardType - The type of card to generate.
 * @returns {Object} The generated card object.
 */
export const generateCard = async (userId, cardType) => {
  validateCardType(cardType);

  const prompt = `Generate a ${cardType} card for a deck-building story game.`;

  const response = await openai.complete({
    engine: 'text-davinci-002',
    prompt,
    maxTokens: 100,
    n: 1,
    stop: null,
    temperature: 0.8,
  });

  const cardContent = response.choices[0].text.trim();

  return {
    userId,
    type: cardType,
    content: cardContent,
    rarity: 'common', // Default rarity
    customization: {},
  };
};