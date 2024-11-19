import { connectToDatabase } from '../../utils/database';
import { verifyToken } from '../../utils/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = await verifyToken(req);

    const db = await connectToDatabase();
    const User = db.collection('users');

    const user = await User.findOne({ _id: ObjectId(userId) }, { projection: { password: 0 } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}