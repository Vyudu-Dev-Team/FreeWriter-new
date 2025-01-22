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
          Return only one word: CHARACTER, WORLD, or CONFLICT`
        },
        {
          role: "user",
          content: storyText
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const cardType = completion.choices[0].message.content.trim();
    
    if (!['CHARACTER', 'WORLD', 'CONFLICT'].includes(cardType)) {
      throw new Error('Invalid card type returned from analysis');
    }

    return cardType;
  } catch (error) {
    throw new Error(`Failed to analyze story card: ${error.message}`);
  }
}

module.exports = {
  analyzeStoryCard
}; 