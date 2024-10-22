import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  return new Promise((resolve, reject) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      reject(new Error('No token provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(new Error('Failed to authenticate token'));
      }
      resolve(decoded);
    });
  });
}