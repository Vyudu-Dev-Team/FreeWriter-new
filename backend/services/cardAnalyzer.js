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
          content: `You are a story analyzer that generates story cards. Your response must be ONLY a valid JSON array containing objects with the following properties:
- Type (must be exactly "CHARACTER", "WORLD", "CONFLICT", or "WILDCARD")
- Name (string)
- Description (string)
- Theme (string)

Use WILDCARD type only if the element strongly fits a unique category beyond the standard ones. If the element doesn't clearly fit any category, use one of the standard types that fits best.

Do not include any markdown formatting, code blocks, or explanatory text. Return ONLY the JSON array.

Example of valid response:
[{"Type":"CHARACTER","Name":"John","Description":"A brave hero","Theme":"Courage"},
{"Type":"WILDCARD","Name":"Time Loop","Description":"A mysterious temporal anomaly","Theme":"Destiny"}]`
        },
        {
          role: "user",
          content: storyText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Limpa qualquer formatação markdown ou texto extra que o GPT possa ter incluído
    let content = completion.choices[0].message.content.trim();
    
    // Remove blocos de código markdown se presentes
    content = content.replace(/```json\n?|\n?```/g, '');
    
    // Garante que o conteúdo começa com [ e termina com ]
    content = content.trim();
    if (!content.startsWith('[')) {
      content = content.substring(content.indexOf('['));
    }
    if (!content.endsWith(']')) {
      content = content.substring(0, content.lastIndexOf(']') + 1);
    }

    const cards = JSON.parse(content);
    
    // Valida se cada carta tem os campos necessários e os tipos corretos
    const validTypes = ['CHARACTER', 'WORLD', 'CONFLICT', 'WILDCARD'];
    const validatedCards = cards.map(card => {
      if (!card.Type || !validTypes.includes(card.Type.toUpperCase())) {
        card.Type = 'CHARACTER'; // Tipo padrão se inválido
      }
      return {
        Type: card.Type.toUpperCase(),
        Name: card.Name || 'Unnamed Card',
        Description: card.Description || 'No description provided',
        Theme: card.Theme || 'No theme provided',
        imageUrl: '/assets/images/default-card.svg'
      };
    });

    return validatedCards;
  } catch (error) {
    console.error('Card analysis error:', error);
    throw new Error(`Failed to analyze story card: ${error.message}`);
  }
}

module.exports = {
  analyzeStoryCard
}; 