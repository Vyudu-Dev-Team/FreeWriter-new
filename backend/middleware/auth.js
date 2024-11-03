import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js'; // Ensure the correct path and extension

export default async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'You are not logged in' });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};