import { connectToDatabase } from '../../../../utils/database';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../../../utils/auth';

export default async function handler(req, res) {
  const { storyId } = req.query;

  try {
    const { userId } = await verifyToken(req);

    const db = await connectToDatabase();
    const Story = db.collection('stories');
    const StoryElement = db.collection('storyElements');

    if (req.method === 'GET') {
      const elements = await StoryElement.find({ storyId: ObjectId(storyId) }).sort({ order: 1 }).toArray();
      res.status(200).json(elements);
    } else if (req.method === 'POST') {
      const { content } = req.body;
      const story = await Story.findOne({ _id: ObjectId(storyId), userId: ObjectId(userId) });

      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      const lastElement = await StoryElement.findOne({ storyId: ObjectId(storyId) }, { sort: { order: -1 } });
      const order = lastElement ? lastElement.order + 1 : 0;

      const newElement = await StoryElement.insertOne({
        storyId: ObjectId(storyId),
        content,
        order,
        createdAt: new Date()
      });

      res.status(201).json({
        _id: newElement.insertedId,
        content,
        order
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