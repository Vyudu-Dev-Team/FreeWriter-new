import OpenAI from 'openai';
import AppError from '../utils/appError.js';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key
});

/**
 * Generate a story prompt based on user preferences
 * @param {Object} params - Parameters for prompt generation
 * @param {string} params.genre - The genre of the story
 * @param {string} params.writingStyle - The preferred writing style
 * @param {string} params.complexity - The desired complexity level
 * @param {string} params.targetAudience - The target audience for the story
 * @returns {Promise<string>} The generated story prompt
 */
export const generateStoryPrompt = async ({ genre, writingStyle, complexity, targetAudience }) => {
  try {
    const prompt = `Generate a story prompt for a ${genre} story. 
    Writing style: ${writingStyle}. 
    Complexity: ${complexity}. 
    Target audience: ${targetAudience}.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a supported chat model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating story prompt:', error);
    throw new AppError('Failed to generate story prompt', 500);
  }
};

/**
 * Generate initial story guidance
 * @param {Object} params - Parameters for story guidance
 * @param {string} params.prompt - The initial story prompt
 * @returns {Promise<Object>} Object containing character, plot, and setting suggestions
 */
export const generateStoryGuidance = async ({ prompt }) => {
  try {
    const guidancePrompt = `Based on the following story prompt: "${prompt}"
    1. Suggest three main characters (name and brief description).
    2. Outline three key plot points.
    3. Describe the primary setting.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: guidancePrompt }],
      max_tokens: 300,
      temperature: 0.8,
    });

    const guidance = response.choices[0].message.content.trim();

    // Safely handle response splitting
    const parts = guidance.split('\n\n');
    if (parts.length < 3) {
      throw new Error('AI response does not contain all required sections.');
    }

    const [characters, plotPoints, setting] = parts;

    return {
      characters: characters.split('\n').slice(1) || [],
      plotPoints: plotPoints.split('\n').slice(1) || [],
      setting: setting?.replace('3. ', '') || 'Setting not provided.',
    };
  } catch (error) {
    console.error('Error generating story guidance:', error);
    throw new AppError('Failed to generate story guidance', 500);
  }
};

