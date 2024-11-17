import { connectToDatabase } from '../../utils/database';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = await verifyToken(req);
    const { title, content } = req.body;

    const db = await connectToDatabase();
    const Story = db.collection('stories');

    const newStory = await Story.insertOne({
      userId: ObjectId(userId),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ 
      _id: newStory.insertedId,
      title,
      content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}