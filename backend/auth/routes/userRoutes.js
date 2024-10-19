const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./config/firebase');
const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Registers a new user by storing their email and hashed password in Firebase
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Hash the user's password using bcrypt with a salt of 10 rounds
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Reference to the Firebase 'users' collection
    const userRef = db.ref('users');
    
    // Create a new user entry in Firebase database
    const newUser = userRef.push();

    // Set email and hashed password in the new user record
    await newUser.set({ email, password: hashedPassword });

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle any potential errors during the registration process
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Logs in a user by validating their email and password, returns a JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query Firebase database to check if the user exists based on email
    const userSnapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
    const userData = userSnapshot.val();

    // If user exists, get their key and compare the provided password with the stored hashed password
    if (userData) {
      const userKey = Object.keys(userData)[0];
      const user = userData[userKey];

      // Compare provided password with stored password using bcrypt
      const isMatch = bcrypt.compareSync(password, user.password);

      if (isMatch) {
        // Generate a JWT token if the password matches
        const token = jwt.sign(
          { id: userKey, email: user.email },
          process.env.JWT_SECRET, // Use JWT secret from environment variables
          { expiresIn: '1h' } // Token expiration time
        );

        // Respond with the generated token
        return res.status(200).json({ token });
      }
    }

    // If credentials are invalid, respond with a 401 status
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    // Handle any potential errors during the login process
    res.status(500).json({ error: error.message });
  }
});
// for testing purpose
router.get('/profile', authenticate, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', userId: req.user.id });
});

module.exports = router;

