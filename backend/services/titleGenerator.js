const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateTitleFromConversation(history) {
  if (!Array.isArray(history) || history.length === 0) {
    throw new Error('Invalid conversation history provided');
  }

  try {
    const conversationText = history
      .filter(msg => msg.role !== 'system')
      .map(msg => msg.content)
      .join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate a short, creative title (maximum 6 words) for a story based on the conversation provided. Return only the title, without quotes or additional text."
        },
        {
          role: "user",
          content: conversationText
        }
      ],
      temperature: 0.7,
      max_tokens: 20
    });

    const title = completion.choices[0].message.content.trim();
    
    if (!title) {
      throw new Error('Failed to generate title');
    }

    return title;
  } catch (error) {
    throw new Error(`Failed to generate title: ${error.message}`);
  }
}

module.exports = {
  generateTitleFromConversation
}; 