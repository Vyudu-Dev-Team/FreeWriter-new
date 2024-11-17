import { connectToDatabase } from '../../utils/database';
import { verifyToken } from '../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = await verifyToken(req);
    const { feedback, rating, featureUsed } = req.body;

    const db = await connectToDatabase();
    const Feedback = db.collection('feedback');

    await Feedback.insertOne({
      userId,
      feedback,
      rating,
      featureUsed,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}