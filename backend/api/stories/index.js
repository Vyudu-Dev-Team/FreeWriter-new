// import { connectToDatabase } from '../../utils/database';
// import { ObjectId } from 'mongodb';
// import { verifyToken } from '../../utils/auth';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   try {
//     const { userId } = await verifyToken(req);

//     const db = await connectToDatabase();
//     const Story = db.collection('stories');

//     const stories = await Story.find({ userId: ObjectId(userId) })
//       .sort({ updatedAt: -1 })
//       .toArray();

//     res.status(200).json(stories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// }