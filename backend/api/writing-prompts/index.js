// import { connectToDatabase } from '../../utils/database';
// // import { verifyToken } from '../../utils/auth';
// import OpenAI from 'openai';

// const openai = new OpenAI(process.env.OPENAI_API_KEY);

// module.exports =  async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   try {
//     await verifyToken(req);

//     const response = await openai.complete({
//       engine: 'text-davinci-002',
//       prompt: 'Generate a creative writing prompt:',
//       maxTokens: 50,
//       n: 1,
//       stop: null,
//       temperature: 0.7,
//     });

//     const prompt = response.choices[0].text.trim();

//     res.status(200).json({ prompt });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// }