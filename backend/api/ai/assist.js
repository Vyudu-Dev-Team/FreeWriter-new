import { connectToDatabase } from '../../utils/database';
import { verifyToken } from '../../utils/auth';
import { ObjectId } from 'mongodb';
import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports =  async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = await verifyToken(req);
    const { storyId, userInput, assistanceType } = req.body;

    const db = await connectToDatabase();
    const Story = db.collection('stories');

    const story = await Story.findOne({ _id: ObjectId(storyId), userId: ObjectId(userId) });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    let prompt = `As an AI writing assistant, help with the following ${assistanceType} request for the story titled "${story.title}": ${userInput}`;

    switch (assistanceType) {
      case 'character':
        prompt += ' Focus on character development, personality traits, and backstory.';
        break;
      case 'plot':
        prompt += ' Provide ideas for plot twists, story arcs, or narrative development.';
        break;
      case 'setting':
        prompt += ' Offer detailed descriptions of the setting, including sensory details and atmosphere.';
        break;
      case 'dialogue':
        prompt += ' Suggest realistic and engaging dialogue that fits the characters and situation.';
        break;
    }

    const response = await openai.complete({
      engine: 'text-davinci-002',
      prompt: prompt,
      maxTokens: 200,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    const suggestion = response.choices[0].text.trim();

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}