const admin = require('firebase-admin');
const connectDB = require("../config/database.js");
const User = require("../models/User.js");
const Profile = require("../models/Profile.js");
const { generateToken: createToken } = require("../utils/jwt.js");
const { errorHandler } = require("../utils/errorHandler.js");
const { sendVerificationEmail } = require("../utils/sendEmail.js");
const AppError = require("../utils/appError.js");

// Initialize Firebase Admin SDK (if not already initialized)
const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    return true;
  } catch (error) {
    logger.error('Firebase initialization error:', error);
    return false;
  }
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB();

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { username, email, password, writingMode, deviceToken } = JSON.parse(event.body);

    const isFirebaseInitialized = initializeFirebase();
    let fcmToken = isFirebaseInitialized ? deviceToken : null;

    const newUser = new User({
      username,
      email,
      password,
      writingMode,
      fcmToken,
      notificationPreferences: {
        email: true,
        push: !!fcmToken,
      },
    });

    await newUser.save();
    await Profile.create({ user: newUser._id });

    const verificationToken = newUser.createEmailVerificationToken();

    // Fire-and-forget email sending
    sendVerificationEmail(newUser, verificationToken).catch((emailError) => {
      console.error("Failed to send verification email:", emailError);
    });

    const token = createToken(newUser._id);
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          fcmToken: newUser.fcmToken,
        },
        message: "User registered successfully. Please check your email to verify your account.",
      }),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return errorHandler(error);
  }
};


module.exports = {
  handler
};