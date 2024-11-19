import { connectToDatabase } from '../utils/database';
import Story from '../models/Story';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const stories = await Story.find().sort({ createdAt: -1 });
      res.status(200).json(stories);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stories' });
    }
  } else if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const story = new Story(req.body);
      await story.save();
      res.status(201).json(story);
    } catch (error) {
      res.status(500).json({ error: 'Error creating story' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};