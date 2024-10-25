import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password, username } = req.body;
   
    const userRecord = await getAuth().createUser({
      email,
      password,
    });

    const user = await User.create({
      uid: userRecord.uid,
      email,
      username,
    });

    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}