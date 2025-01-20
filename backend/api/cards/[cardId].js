import { connectToDatabase } from '../../utils/database';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../utils/auth';

module.exports =  async function handler(req, res) {
  const { cardId } = req.query;

  try {
    const { userId } = await verifyToken(req);

    const db = await connectToDatabase();
    const Card = db.collection('cards');

    if (req.method === 'PUT') {
      const { name, description, customFields } = req.body;

      const result = await Card.findOneAndUpdate(
        { _id: ObjectId(cardId), userId },
        { $set: { name, description, customFields, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ message: 'Card not found' });
      }

      res.status(200).json(result.value);
    } else if (req.method === 'DELETE') {
      const result = await Card.deleteOne({ _id: ObjectId(cardId), userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Card not found' });
      }

      res.status(200).json({ message: 'Card deleted successfully' });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}