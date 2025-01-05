import { connectToDatabase } from '../../../utils/database';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../../utils/auth';

module.exports =  async function handler(req, res) {
  const { storyId } = req.query;

  try {
    const { userId } = await verifyToken(req);

    const db = await connectToDatabase();
    const Story = db.collection('stories');

    if (req.method === 'GET') {
      const story = await Story.findOne({ _id: ObjectId(storyId), userId: ObjectId(userId) });

      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }

      res.status(200).json({ progress: story.progress || 0, goal: story.goal || 50000 });
    } else if (req.method === 'PUT') {
      const { progress } = req.body;

      const result = await Story.findOneAndUpdate(
        { _id: ObjectId(storyId), userId: ObjectId(userId) },
        { $set: { progress, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ message: 'Story not found' });
      }

      res.status(200).json({ progress: result.value.progress, goal: result.value.goal || 50000 });
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}