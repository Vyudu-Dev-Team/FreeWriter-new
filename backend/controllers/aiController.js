import { generateStoryPrompt, generateStoryGuidance } from '../services/aiService.js';
import AppError from '../utils/appError.js';
import Feedback from '../models/Feedback.js';

/**
 * Generate a story prompt based on user preferences
 * @route POST /api/ai/prompt
 * @access Private
 */
export const getStoryPrompt = async (req, res, next) => {
  const { genre, writingStyle, complexity, targetAudience } = req.body;

  if (!genre || !writingStyle || !complexity || !targetAudience) {
    return next(new AppError('Missing required parameters', 400));
  }

  const prompt = await generateStoryPrompt({ genre, writingStyle, complexity, targetAudience });

  res.status(200).json({
    status: 'success',
    data: { prompt }
  });
};

/**
 * Generate initial story guidance based on a prompt
 * @route POST /api/ai/guidance
 * @access Private
 */
export const getStoryGuidance = async (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt) {
    return next(new AppError('Missing story prompt', 400));
  }

  const guidance = await generateStoryGuidance({ prompt });

  res.status(200).json({
    status: 'success',
    data: { guidance }
  });
};


/**
 * Submit feedback for a generated prompt or guidance
 * @route POST /api/ai/feedback
 * @access Private
 */
export const submitFeedback = async (req, res, next) => {
  const { promptId, rating, comments } = req.body;

  if (!promptId || !rating) {
    return next(new AppError('Missing required parameters', 400));
  }

  const feedback = await Feedback.create({
    user: req.user.id,
    promptId,
    rating,
    comments
  });

  res.status(201).json({
    status: 'success',
    data: { feedback }
  });
};