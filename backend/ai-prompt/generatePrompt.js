require('dotenv').config(); // Load environment variables from .env
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Load OpenAI API key from env
});

const openai = new OpenAIApi(configuration);

// Export default handler for Vercel serverless function
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { genre, theme, characterDetails } = req.body;

        try {
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: `Generate a ${genre} prompt with theme ${theme} and character details ${characterDetails}` },
                ],
            });

            res.status(200).json({ prompt: response.data.choices[0].message.content });
        } catch (error) {
            console.error("Error generating prompt:", error);
            res.status(500).json({ error: 'Failed to generate prompt' });
        }
    } else {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
