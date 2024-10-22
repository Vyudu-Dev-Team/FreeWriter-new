import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Prompt generation based on user preferences and writing mode
export const generatePrompt = async (user, writingMode) => {
  const prompt = `Generate a creative writing prompt for a ${writingMode} writer interested in ${user.preferences.genres.join(', ')}:`;
  
  const response = await openai.complete({
    engine: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 100,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  return response.choices[0].text.trim();
};

// Generate feedback on user's writing
export const generateFeedback = async (content, writingMode) => {
  const prompt = `Provide constructive feedback for a ${writingMode} writer on the following content:\n\n${content}\n\nFeedback:`;

  const response = await openai.complete({
    engine: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 200,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  return response.choices[0].text.trim();
};

// Generate AI onboarding message based on writing mode
export const generateAIOnboarding = async (writingMode) => {
  const prompt = writingMode === 'Plotter' 
    ? 'Generate an onboarding message for a writer who prefers detailed planning:'
    : 'Generate an onboarding message for a writer who prefers spontaneous writing:';

  const response = await openai.complete({
    engine: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  return response.choices[0].text.trim();
};

// Generate sketch-level artwork for cards
export const generateCardArtwork = async (cardType, description) => {
  const prompt = `Generate a simple, sketch-style image for a ${cardType} card with the following description: ${description}`;

  const response = await axios.post('https://api.openai.com/v1/images/generations', {
    prompt: prompt,
    n: 1,
    size: "256x256",
    response_format: "url"
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.data[0].url;
};

// Process user input for dynamic story assistance
export const processUserInput = async (input, context) => {
  const prompt = `Given the following story context: ${context}\n\nAnd the user input: ${input}\n\nProvide a helpful suggestion or guidance for the next part of the story:`;

  const response = await openai.complete({
    engine: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  return response.choices[0].text.trim();
};