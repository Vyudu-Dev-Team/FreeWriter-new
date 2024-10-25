import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
   
    const userRecord = await getAuth().getUserByEmail(email);
   
    // In a real-world scenario, you'd verify the password here
    // For MVP, we're assuming the password is correct if the email exists

    const user = await User.getById(userRecord.uid);

    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}