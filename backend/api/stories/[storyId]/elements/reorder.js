import { connectToDatabase } from '../../../../utils/database';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../../../utils/auth';

module.exports =  async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { storyId } = req.query;
  const { elements } = req.body;

  try {
    const { userId } = await verifyToken(req);

    const db = await connectToDatabase();
    const Story = db.collection('stories');
    const StoryElement = db.collection('storyElements');

    const story = await Story.findOne({ _id: ObjectId(storyId), userId: ObjectId(userId) });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const bulkOps = elements.map((element, index) => ({
      updateOne: {
        filter: { _id: ObjectId(element._id) },
        update: { $set: { order: index } }
      }
    }));

    await StoryElement.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Elements reordered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}