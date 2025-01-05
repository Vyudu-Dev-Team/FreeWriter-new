const Story = require( '../models/story.js');
const Card = require( '../models/Card.js');
const { validateStoryIntegration } = require( '../utils/validators.js');

/**
 * Integrates a card into a user's story.
 * @param {string} userId - The ID of the user.
 * @param {string} storyId - The ID of the story.
 * @param {string} cardId - The ID of the card to integrate.
 * @returns {Object} The updated story.
 */
const integrateCardIntoStory = async (userId, storyId, cardId) => {
  validateStoryIntegration(userId, storyId, cardId);

  const story = await Story.findOne({ _id: storyId, userId });
  const card = await Card.findById(cardId);

  if (!story || !card) {
    throw new Error('Story or card not found');
  }

  // Logic to integrate the card into the story
  story.content += `\n\n[Card Integration: ${card.content}]`;
  story.integratedCards.push(cardId);

  return await story.save();
};
module.exports = {
  integrateCardIntoStory,
};