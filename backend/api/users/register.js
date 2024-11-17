import { connectToDatabase } from '../../utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { username, email, password, writingMode } = req.body;

    // Input validation
    if (!username || !email || !password || !writingMode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!['Plotter', 'Pantser'].includes(writingMode)) {
      return res.status(400).json({ message: 'Invalid writing mode' });
    }

    // Connect to the database
    const db = await connectToDatabase();
    const User = db.collection('users');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.insertOne({
      username,
      email,
      password: hashedPassword,
      writingMode,
      createdAt: new Date()
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.insertedId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}