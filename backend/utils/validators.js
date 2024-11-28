import AppError from './appError.js';
import mongoose from 'mongoose';

export const validateCardType = (cardType) => {
  const validTypes = ['character', 'plot', 'setting', 'theme'];
  if (!validTypes.includes(cardType)) {
    throw new AppError(`Invalid card type. Must be one of: ${validTypes.join(', ')}`, 400);
  }
};

export const validateCustomization = (customization) => {
  if (typeof customization !== 'object' || customization === null) {
    throw new AppError('Customization must be a non-null object', 400);
  }

  const allowedKeys = ['color', 'icon', 'tags', 'notes'];
  const invalidKeys = Object.keys(customization).filter(key => !allowedKeys.includes(key));
  if (invalidKeys.length > 0) {
    throw new AppError(`Invalid customization keys: ${invalidKeys.join(', ')}`, 400);
  }

  if (customization.color && !/^#[0-9A-F]{6}$/i.test(customization.color)) {
    throw new AppError('Invalid color format. Must be a valid hex color code', 400);
  }

  if (customization.icon && typeof customization.icon !== 'string') {
    throw new AppError('Icon must be a string', 400);
  }

  if (customization.tags && (!Array.isArray(customization.tags) || customization.tags.some(tag => typeof tag !== 'string'))) {
    throw new AppError('Tags must be an array of strings', 400);
  }

  if (customization.notes && typeof customization.notes !== 'string') {
    throw new AppError('Notes must be a string', 400);
  }

  if (customization.tags && customization.tags.length > 5) {
    throw new AppError('Maximum of 5 tags allowed', 400);
  }

  if (customization.notes && customization.notes.length > 500) {
    throw new AppError('Notes cannot exceed 500 characters', 400);
  }
};

export const validateRarity = (rarity) => {
  const validRarities = ['common', 'uncommon', 'rare', 'legendary'];
  if (!validRarities.includes(rarity)) {
    throw new AppError(`Invalid rarity. Must be one of: ${validRarities.join(', ')}`, 400);
  }
};

export const validateDeckOperation = (userId, deckId, operation) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('Invalid user ID', 400);
  }
  if (!deckId || !mongoose.Types.ObjectId.isValid(deckId)) {
    throw new AppError('Invalid deck ID', 400);
  }
  const validOperations = ['view', 'edit', 'organize', 'delete', 'share'];
  if (!validOperations.includes(operation)) {
    throw new AppError(`Invalid operation. Must be one of: ${validOperations.join(', ')}`, 400);
  }
};

export const validateStoryIntegration = (userId, storyId, cardId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('Invalid user ID', 400);
  }
  if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
    throw new AppError('Invalid story ID', 400);
  }
  if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
    throw new AppError('Invalid card ID', 400);
  }
};

export const validateCardContent = (content) => {
  if (typeof content !== 'string') {
    throw new AppError('Card content must be a string', 400);
  }
  if (content.length < 10 || content.length > 1000) {
    throw new AppError('Card content must be between 10 and 1000 characters', 400);
  }
};

export const validateDeckName = (name) => {
  if (typeof name !== 'string') {
    throw new AppError('Deck name must be a string', 400);
  }
  if (name.length < 3 || name.length > 50) {
    throw new AppError('Deck name must be between 3 and 50 characters', 400);
  }
};

export const validateDeckSize = (cards) => {
  if (!Array.isArray(cards)) {
    throw new AppError('Cards must be an array', 400);
  }
  if (cards.length > 100) {
    throw new AppError('A deck cannot contain more than 100 cards', 400);
  }
};

export const validateCardBalance = (cards) => {
  const typeCounts = cards.reduce((acc, card) => {
    acc[card.type] = (acc[card.type] || 0) + 1;
    return acc;
  }, {});

  const totalCards = cards.length;
  const maxPercentage = 0.4; // No more than 40% of one type

  for (const [type, count] of Object.entries(typeCounts)) {
    if (count / totalCards > maxPercentage) {
      throw new AppError(`Too many ${type} cards. Maximum 40% of deck allowed for each type.`, 400);
    }
  }
};

export const validateStoryProgress = (progress) => {
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    throw new AppError('Story progress must be a number between 0 and 100', 400);
  }
};

export const validateCardInteraction = (interaction) => {
  const validInteractions = ['draw', 'play', 'discard'];
  if (!validInteractions.includes(interaction)) {
    throw new AppError(`Invalid card interaction. Must be one of: ${validInteractions.join(', ')}`, 400);
  }
};

export const validateAIPrompt = (prompt) => {
  if (typeof prompt !== 'string') {
    throw new AppError('AI prompt must be a string', 400);
  }
  if (prompt.length < 10 || prompt.length > 500) {
    throw new AppError('AI prompt must be between 10 and 500 characters', 400);
  }
};