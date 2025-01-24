const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function analyzeStoryCard(storyText) {
  if (!storyText || typeof storyText !== 'string') {
    throw new Error('Invalid story text provided');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze the story text and determine which card type best represents its main focus:
          CHARACTER - If the story focuses on personality, goals, abilities, or personal challenges
          WORLD - If the story emphasizes setting, environment, culture, or world-building
          CONFLICT - If the story centers on challenges, problems, or opposing forces
          Return all compatible card types in list javascript format: ["WORLD", "CONFLICT"]`
        },
        {
          role: "user",
          content: storyText
        }
      ],
      temperature: 0.3,
      max_tokens: 50
    });

    const cardTypes = JSON.parse(completion.choices[0].message.content.trim());
    
    if (!Array.isArray(cardTypes) || !cardTypes.every(type => ['CHARACTER', 'WORLD', 'CONFLICT'].includes(type))) {
      throw new Error('Invalid card types returned from analysis');
    }

    return cardTypes;
  } catch (error) {
    throw new Error(`Failed to analyze story card: ${error.message}`);
  }
}

module.exports = {
  analyzeStoryCard
}; 