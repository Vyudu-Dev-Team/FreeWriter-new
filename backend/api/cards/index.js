import { connectToDatabase } from '../../utils/database';
import { verifyToken } from '../../utils/auth';

export default async function handler(req, res) {
  try {
    const { userId } = await verifyToken(req);

    const db = await connectToDatabase();
    const Card = db.collection('cards');

    if (req.method === 'GET') {
      const cards = await Card.find({ userId }).toArray();
      res.status(200).json(cards);
    } else if (req.method === 'POST') {
      const { type, name, description, customFields } = req.body;

      const newCard = await Card.insertOne({
        userId,
        type,
        name,
        description,
        customFields,
        createdAt: new Date()
      });

      res.status(201).json({
        _id: newCard.insertedId,
        type,
        name,
        description,
        customFields
      });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}