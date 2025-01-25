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
          content: `Analyze the story text and generate story cards with the following structure:
          - Type (CHARACTER, WORLD, or CONFLICT)
          - Name (a unique name for the card)
          - Description (detailed description of the card element)
          - Theme (brief explanation of how this element relates to the story)
          
          Return the cards in JSON format as an array of objects with these properties.
          You can generate multiple cards of the same type if appropriate.`
        },
        {
          role: "user",
          content: storyText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const cards = JSON.parse(completion.choices[0].message.content.trim());
    
    // Adiciona imageUrl padrão para cada carta
    const processedCards = cards.map(card => ({
      ...card,
      imageUrl: '/assets/images/default-card.svg'
    }));

    return processedCards;
  } catch (error) {
    throw new Error(`Failed to analyze story card: ${error.message}`);
  }
}

module.exports = {
  analyzeStoryCard
}; 