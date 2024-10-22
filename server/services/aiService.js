import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// ... (existing functions)

export const generateSketch = async (description) => {
  try {
    const response = await openai.createImage({
      prompt: `Simple sketch-style illustration of: ${description}`,
      n: 1,
      size: '256x256',
      response_format: 'url'
    });

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating sketch:', error);
    throw error;
  }
};

export const improveSketch = async (sketchUrl, feedback) => {
  try {
    const response = await openai.createImage({
      prompt: `Improve this sketch based on feedback: ${feedback}`,
      n: 1,
      size: '256x256',
      response_format: 'url',
      image: sketchUrl
    });

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error improving sketch:', error);
    throw error;
  }
};