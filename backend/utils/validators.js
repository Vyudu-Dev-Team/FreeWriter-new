const AppError = require( './appError.js');
const mongoose = require( 'mongoose');
const Joi = require( 'joi');
const { v4: uuidv4 } = require("uuid");

const validateCardType = (cardType) => {
  const validTypes = ['character', 'plot', 'setting', 'theme'];
  if (!validTypes.includes(cardType)) {
    throw new AppError(`Invalid card type. Must be one of: ${validTypes.join(', ')}`, 400);
  }
};

const validateCustomization = (customization) => {
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

const validateRarity = (rarity) => {
  const validRarities = ['common', 'uncommon', 'rare', 'legendary'];
  if (!validRarities.includes(rarity)) {
    throw new AppError(`Invalid rarity. Must be one of: ${validRarities.join(', ')}`, 400);
  }
};

const validateDeckOperation = (userId, deckId, operation) => {
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

const validateStoryIntegration = (userId, storyId, cardId) => {
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

const validateCardContent = (content) => {
  if (typeof content !== 'string') {
    throw new AppError('Card content must be a string', 400);
  }
  if (content.length < 10 || content.length > 1000) {
    throw new AppError('Card content must be between 10 and 1000 characters', 400);
  }
};

const validateDeckName = (name) => {
  if (typeof name !== 'string') {
    throw new AppError('Deck name must be a string', 400);
  }
  if (name.length < 3 || name.length > 50) {
    throw new AppError('Deck name must be between 3 and 50 characters', 400);
  }
};

const validateDeckSize = (cards) => {
  if (!Array.isArray(cards)) {
    throw new AppError('Cards must be an array', 400);
  }
  if (cards.length > 100) {
    throw new AppError('A deck cannot contain more than 100 cards', 400);
  }
};

const validateCardBalance = (cards) => {
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

const validateStoryProgress = (progress) => {
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    throw new AppError('Story progress must be a number between 0 and 100', 400);
  }
};

const validateCardInteraction = (interaction) => {
  const validInteractions = ['draw', 'play', 'discard'];
  if (!validInteractions.includes(interaction)) {
    throw new AppError(`Invalid card interaction. Must be one of: ${validInteractions.join(', ')}`, 400);
  }
};

const validateAIPrompt = (prompt) => {
  if (typeof prompt !== 'string') {
    throw new AppError('AI prompt must be a string', 400);
  }
  if (prompt.length < 10 || prompt.length > 500) {
    throw new AppError('AI prompt must be between 10 and 500 characters', 400);
  }
};

const validateStoryMap = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),  // Make description optional
    elements: Joi.array().items(Joi.object({
      type: Joi.string().valid('chapter', 'scene', 'character', 'plot', 'setting').required(),
      title: Joi.string().required(),
    })).required(),
  });

  return schema.validate(data);
};

const validateOutline = (data) => {
  // Recursive section schema
  const createSectionSchema = () => Joi.object({
    id: Joi.string().default(() => uuidv4()),
    title: Joi.string().required(),
    content: Joi.string().allow('').optional(),
    children: Joi.array().items(Joi.link('...')).optional()
  });

  const schema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('plotter', 'pantser').default('plotter'),
    sections: Joi.array().items(createSectionSchema()).required(),
  }).options({ 
    allowUnknown: false,
    abortEarly: false 
  });

  const { error, value } = schema.validate(data);
  
  if (error) {
    throw new Error(`Validation Error: ${error.details.map(d => d.message).join(', ')}`);
  }

  // Ensure all sections have IDs
  const processSection = (section) => ({
    ...section,
    id: section.id || uuidv4(),
    children: section.children ? section.children.map(processSection) : []
  });

  return {
    ...value,
    sections: value.sections.map(processSection)
  };
};


const validateWritingSession = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().allow('').optional(),
    wordCount: Joi.number().integer().min(0).default(0),
    duration: Joi.number().integer().min(0).optional(), // Keep for frontend flexibility
    lastSaved: Joi.date().iso().default(() => new Date()),
  }).options({ allowUnknown: false });

  return schema.validate(data);
};

const validateAIFeedbackRequest = (data) => {
  const schema = Joi.object({
    text: Joi.string().required(),
    genre: Joi.string().required(),
    style: Joi.string().required(),
  });

  return schema.validate(data);
};


const validateDragAndDropOperation = (data) => {
  const schema = Joi.object({
    elementId: Joi.string().required(),
    sourcePosition: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required(),
    }).required(),
    targetPosition: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required(),
    }).required(),
  });

  return schema.validate(data);
};

module.exports = {
  validateDragAndDropOperation,
  validateAIFeedbackRequest,
  validateWritingSession,
  validateOutline,
  validateStoryMap,
  validateAIPrompt,
  validateCardInteraction,
  validateCardBalance,
  validateDeckSize,
  validateStoryProgress,
  validateDeckName,
  validateCardContent,
  validateStoryIntegration,
  validateDeckOperation,
  validateRarity,
  validateCustomization,
  validateCardType,
};