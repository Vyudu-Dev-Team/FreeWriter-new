const User = require("../models/User.js");
const Story = require("../models/story.js");
const Card = require("../models/Card.js");
const Deck = require("../models/Deck.js");
const Profile = require("../models/Profile.js");
const StoryMap = require("../models/StoryMap.js");
const Outline = require("../models/Outline.js");
const WritingSession = require("../models/WritingSession.js");
const {
  verifyToken,
  generateToken,
  verifyEmailToken,
} = require("../utils/jwt.js");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/sendEmail.js");
const {
  updatePreferences,
  getPreferences,
  resetPreferences,
} = require("../services/preferencesService.js");
const {
  validateCardType,
  validateCustomization,
  validateRarity,
  validateDeckOperation,
  validateStoryIntegration,
  validateStoryMap,
  validateOutline,
  validateWritingSession,
  validateAIFeedbackRequest,
} = require("../utils/validators.js");
const AppError = require("../utils/appError.js");
const logger = require("../utils/logger.js");
const {
  generateAIFeedback,
  generateStoryPrompt,
} = require("../services/aiService.js");
const { adjustAIParameters } = require("../services/aiFeedbackService.js");
const { 
  subscribeToNotifications,
  sendEmailNotification,
  sendPushNotification,
  notifyInactiveUsers,
  awardPoints,
  checkAndAwardBadge,
  getUserRewards,

} = require("../services/notificationService.js");
  
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
const OpenAI = require("openai");

// Debug logs for OpenAI API Key
console.log('Environment:', process.env.NODE_ENV);
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length);
console.log('Env variables loaded:', Object.keys(process.env));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test OpenAI connection
const testOpenAIConnection = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test connection" }],
      max_tokens: 5
    });
    console.log('OpenAI connection successful:', response.choices[0].message);
    return true;
  } catch (error) {
    console.error('OpenAI connection error:', error.message);
    return false;
  }
};

testOpenAIConnection();

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

const handleUserRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/users", "");
  const createResponse = (statusCode, message) => ({
    statusCode,
    body: JSON.stringify({ message }),
  });
  switch (`${httpMethod} ${route}`) {
    case "GET /current-user":
      return getCurrentUser(event);
    case "POST /register":
      return register(JSON.parse(event.body));
    case "POST /login":
      return login(JSON.parse(event.body));
    case "GET /profile":
      return getUserProfile(event);
    case "PUT /profile":
      return updateUserProfile(event);
    case "POST /forgot-password":
      return forgotPassword(JSON.parse(event.body));
    case "POST /reset-password":
      return resetPassword(JSON.parse(event.body));
    case "GET /verify-email":
    case "POST /verify-email":
      return verifyEmail(event);
    case "POST /resend-verification":
      return resendVerification(JSON.parse(event.body));
    case "GET /preferences":
      return getUserPreferences(event);
    case "PUT /preferences":
      return updateUserPreferences(event);
    case "POST /reset-preferences":
      return resetUserPreferences(event);
    default:
      return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };
  }
};

const handleAIRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/ai", "");

  switch (`${httpMethod} ${route}`) {
    case "POST /generate-story-prompt":
      return generateAndSaveStoryPrompt(event); // Pass the parsed body
    case "POST /generate-prompt":
      return generatePrompt(event);
    case "POST /generate-guidance":
      return generateGuidance(event);
    case "POST /submit-feedback":
      return submitFeedback(event);
    case "POST /dashboard-analysis":
      return dashboardAnalysis(event);
    case "POST /interaction":
      return conversationInteractions(event);
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
      };
  }
};

const handleStoryRoutes = async (event) => {
  const { httpMethod, path } = event;

  // Extract outline ID from the path, ensuring it matches the MongoDB ObjectId format
  const storyIdMatch = path.match(/\/([a-fA-F0-9]{24})$/);
  const storyId = storyIdMatch ? storyIdMatch[1] : null;

  switch (true) {
    case httpMethod === "POST" && path === "/get-or-create":
      return getOrCreateStory(event);
    case httpMethod === "POST" && path === "/":
      return createStory(event);

    case httpMethod === "GET" && path === "/":
      return getStories(event);

    case httpMethod === "GET" && !!storyId:
      return getStory(event, storyId);

    case httpMethod === "PUT" && !!storyId:
      return updateStory(event, storyId);

    case httpMethod === "DELETE" && !!storyId:
      return deleteStory(event, storyId);
    default:
      console.log("No matching route found.");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
      };
  }
};

const handleDeckRoutes = async (event) => {
  const { httpMethod, path } = event;

  // Extract deck ID manually
  const deckId = extractDeckId(event);

  if (httpMethod === "GET" && deckId) return getDeck(event, deckId);
  if (httpMethod === "PUT" && deckId) return updateDeck(event, deckId);
  if (httpMethod === "DELETE" && deckId) return deleteDeck(event, deckId);
  if (httpMethod === "GET" && path === "/decks") return getUserDecks(event);
  if (httpMethod === "POST" && path === "/decks") return createDeck(event);

  return {
    statusCode: 405,
    body: JSON.stringify({
      message: `Method ${httpMethod} not allowed for path ${path}`,
    }),
  };
};

const handleCardRoutes = async (event) => {
  try {
    const { httpMethod, path, pathParameters } = event;
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) {
      return userResponse;
    }
    const userId = JSON.parse(userResponse.body).user.id;

    // Extract cardId from pathParameters or path
    const cardId = pathParameters?.id || extractCardId(path);

    switch (true) {
      case httpMethod === "POST" && path === "/generate":
        return generateCard(event, userId);

      case httpMethod === "PUT" && path.includes("/customize"):
        return customizeCard(event, userId, cardId);

      case httpMethod === "PUT" && path.includes("/rarity"):
        return setCardRarity(event, userId, cardId);

      case httpMethod === "POST" && path.includes("/integrate"):
        return integrateCardIntoStory(event, userId, cardId);

      case httpMethod === "GET" && cardId && cardId.length === 24:
        return getCard(event, userId, cardId);

      case httpMethod === "DELETE" && cardId && cardId.length === 24:
        return deleteCard(event, userId, cardId);

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Not Found" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred processing the request",
      }),
    };
  }
};

const handleOutlineRoutes = async (event) => {
  const { httpMethod, path } = event;

  // Extract outline ID from the path, ensuring it matches the MongoDB ObjectId format
  const outlineIdMatch = path.match(/\/([a-fA-F0-9]{24})$/);
  const outlineId = outlineIdMatch ? outlineIdMatch[1] : null;

  switch (true) {
    case httpMethod === "POST" && path === "/":
      return createOutline(event);

    case httpMethod === "GET" && path === "/":
      return getAllOutlines(event);

    case httpMethod === "GET" && !!outlineId:
      return getOutline(event, outlineId);

    case httpMethod === "PUT" && !!outlineId:
      return updateOutline(event, outlineId);

    case httpMethod === "DELETE" && !!outlineId:
      return deleteOutline(event, outlineId);

    default:
      console.log("No matching route found.");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
      };
  }
};

const handleStoryMappingRoutes = async (event) => {
  const { httpMethod, path } = event;
  const idMatch = path.match(/\/([a-fA-F0-9]{24})$/);
  const storyMapId = idMatch ? idMatch[1] : null;

  switch (true) {
    case httpMethod === "POST" && path === "/story-mapping":
      return createStoryMap(JSON.parse(event.body));

    case httpMethod === "GET" && !!storyMapId:
      return getStoryMap(event, storyMapId); // Pass storyMapId as a separate argument

    case httpMethod === "PUT" && !!storyMapId:
      return updateStoryMap(event, storyMapId); // Pass storyMapId as a separate argument

    case httpMethod === "DELETE" && !!storyMapId:
      return deleteStoryMap(event, storyMapId); // Pass storyMapId as a separate argument

    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
      };
  }
};

const handleWritingEnvironmentRoutes = async (event) => {
  const { httpMethod, path } = event;

  const idMatch = path.match(/\/([a-fA-F0-9]{24})$/);
  const writtingId = idMatch ? idMatch[1] : null;

  switch (true) {
    case httpMethod === "POST" && path === "writing-environment/sessions":
      return createWritingSession(JSON.parse(event.body));

    case httpMethod === "GET" && !!writtingId:
      return getWritingSession(event, writtingId);

    case httpMethod === "PUT" && !!writtingId:
      return updateWritingSession(event, writtingId);

    case httpMethod === "DELETE" && !!writtingId:
      return deleteWritingSession(event, writtingId);

    case httpMethod === "POST" && path === "writing-environment/feedback":
      return getAIFeedback(event);
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
      };
  }
};

const handleNotificationRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/notifications", "");

  switch (`${httpMethod} ${route}`) {
    case "POST /subscribe":
      return subscribeToNotificationsHandler(event);
    case "POST /send-email":
      return sendEmailNotificationHandler(event);
    case "POST /send-push":
      return sendPushNotificationHandler(event);
    case "POST /award-points":
      return awardPointsHandler(event);
    case "GET /rewards":
      return getUserRewardsHandler(event);
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
      };
  }
};

// user endpoints
const getCurrentUser = async (event) => {
  try {
    const authHeader = event.headers?.authorization;
    const token = authHeader?.replace("Bearer ", "").trim();
    
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "No token provided" }),
      };
    }
    
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          writingMode: user.writingMode,
          goals: user.goals,
          fcmToken: user.fcmToken, // Added fcmToken to the response
        },
      }),
    };
  } catch (error) {
    logger.error("Get current user error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching current user" }),
    };
  }
};

const register = async (userData) => {
  const { username, email, password, writingMode, deviceToken } = userData;

  if (!username || !email || !password) {
    throw new AppError("Please provide all required fields", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // Initialize Firebase only when needed
  const isFirebaseInitialized = initializeFirebase();
  let fcmToken = isFirebaseInitialized ? deviceToken : null;

  if (fcmToken) {
    try {
      // Validate FCM token
      await admin.messaging().send({
        token: fcmToken,
        data: { type: 'TEST' },
      }, true);
    } catch (error) {
      logger.warn("Invalid FCM token provided:", error);
      fcmToken = null; // Invalidate the token
    }
  }

  const user = new User({
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

  await user.save();

  const verificationToken = generateToken({ userId: user._id }, "1d");
  logger.info("Generated Verification Token:", verificationToken);

  // Fire-and-forget email sending
  sendVerificationEmail(user, verificationToken).catch((emailError) => {
    logger.error("Failed to send verification email:", emailError);
  });

  // Send welcome notification if FCM token is valid
  if (fcmToken) {
    admin.messaging()
      .send({
        token: fcmToken,
        notification: { title: 'Welcome', body: 'Thank you for registering!' },
      })
      .catch((error) => {
        logger.error("Failed to send welcome notification:", error);
      });
  }

  return {
    statusCode: 201,
    body: {
      message: "User registered successfully. Please check your email to verify your account.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fcmToken: user.fcmToken,
      },
    },
  };
};

const login = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ userId: user._id });

  return {
    statusCode: 200,
    body: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    },
  };
};

const getUserProfile = async (event) => {
  try {
    const token = event.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError("No token found. Please log in.", 401);
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw new AppError("Invalid token", 401);
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          writingMode: user.writingMode,
          // Add any other fields you want to return
        },
      }),
    };
  } catch (error) {
    logger.error("Error fetching user profile:", error);
    throw new AppError(
      error.message || "Failed to fetch user profile",
      error.statusCode || 500
    );
  }
};

const updateUserProfile = async (event) => {
  try {
    // Extract token from Authorization header
    const token = event.headers?.authorization?.split(" ")[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Authentication token is required" }),
      };
    }

    // Verify token and get decoded user data
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid authentication token" }),
      };
    }

    // Parse request body
    const updates = JSON.parse(event.body);
    const { username, bio, writingMode, goals } = updates;

    // Find and update user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Check for username uniqueness if username is being updated
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Username already exists" }),
        };
      }
      user.username = username;
    }

    // Update other fields
    if (writingMode) user.writingMode = writingMode;
    if (goals) user.goals = goals;

    // Save user changes
    await user.save();

    // Update profile if bio is provided
    if (bio) {
      await Profile.findOneAndUpdate(
        { user: decoded.userId },
        { bio },
        { new: true, upsert: true, runValidators: true }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          username: user.username,
          writingMode: user.writingMode,
          goals: user.goals,
        },
      }),
    };
  } catch (error) {
    logger.error("Update profile error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message:
          error.message || "An error occurred while updating the profile",
      }),
    };
  }
};

const forgotPassword = async ({ email }) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("No user found with that email address", 404);
  }

  try {
    // Generate a reset token
    const resetToken = generateToken({ userId: user._id }, "10m"); // Token expires in 10 minutes

    // Send the email
    await sendPasswordResetEmail(user, resetToken);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password reset email sent" }),
    };
  } catch (error) {
    logger.error("Error in forgotPassword:", error);
    throw new AppError(
      error.message || "Failed to send password reset email",
      500
    );
  }
};

const resetPassword = async (event) => {
  try {
    // Access token and newPassword directly from the event
    const { token, newPassword } = event;

    if (!token || !newPassword) {
      throw new AppError("Token and new password are required", 400);
    }

    // Verify the token (now it will work even if token is in the body)
    const decoded = await verifyToken(event); // Pass event to verifyToken
    if (!decoded || !decoded.userId) {
      throw new AppError("Invalid or expired token", 400);
    }

    // Find the user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password reset successful" }),
    };
  } catch (error) {
    logger.error("Reset password error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "Password reset failed",
      }),
    };
  }
};

const verifyEmail = async (event) => {
  try {
    const { token } = JSON.parse(event.body);

    if (!token) {
      throw new AppError("Verification token is required", 400);
    }

    // Use the new verifyEmailToken function instead of verifyToken
    const decoded = await verifyEmailToken(token);

    if (!decoded.userId) {
      throw new AppError("Invalid token format", 400);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Email already verified",
          token: token,
        }),
      };
    }

    user.isEmailVerified = true;
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email verified successfully",
        token: token,
      }),
    };
  } catch (error) {
    logger.error("Verification error:", error);
    throw new AppError(
      error.message || "Error verifying email",
      error.statusCode || 400
    );
  }
};

const resendVerification = async ({ email }) => {
  try {
    // Validate email presence
    if (!email) {
      return createResponse(400, "Email is required");
    }

    // Find user and validate verification status
    const user = await User.findOne({ email });
    if (!user) {
      return createResponse(404, "No user found with that email address");
    }

    if (user.isEmailVerified) {
      return createResponse(400, "Email is already verified");
    }

    // Generate and send new verification token
    const verificationToken = generateToken({ userId: user._id }, "1d");

    try {
      await sendVerificationEmail(user, verificationToken);
      return createResponse(
        200,
        "Verification email resent successfully. Please check your email."
      );
    } catch (error) {
      logger.error("Error sending verification email:", error);
      return createResponse(
        500,
        "Failed to send verification email. Please try again later."
      );
    }
  } catch (error) {
    logger.error("Resend verification error:", error);
    return createResponse(
      500,
      error.message || "An error occurred while resending verification email"
    );
  }
};

const getUserPreferences = async (event) => {
  try {
    const userId = await verifyToken(event);
    const preferences = await getPreferences(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ preferences }), // Ensure this is a valid JSON string
    };
  } catch (error) {
    logger.error("Get preferences error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "An error occurred" }),
    };
  }
};

const updateUserPreferences = async (event) => {
  try {
    const userId = await verifyToken(event);
    const { preferences } = JSON.parse(event.body);

    // Update preferences in the database
    const updatedPreferences = await updatePreferences(userId, preferences);

    return {
      statusCode: 200,
      body: JSON.stringify({ preferences: updatedPreferences }), // Ensure this is a valid JSON string
    };
  } catch (error) {
    logger.error("Update preferences error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "An error occurred" }),
    };
  }
};
const resetUserPreferences = async (event) => {
  const userId = await verifyToken(event);

  if (!userId) {
    throw new AppError("User ID is invalid", 400); // Handle invalid user ID
  }

  const preferences = await resetPreferences(userId); // Use a different variable name

  return {
    statusCode: 200,
    body: JSON.stringify({ preferences }), // Ensure the response is JSON stringified
  };
};

// story endpoints
const getOrCreateStory = async (event) => {
  try {
    const { userId, title, genre } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User ID is required." }),
      };
    }

    let story = await Story.findOne({
      author: userId,
      genre: genre,
    });

    if (!story) {
      story = new Story({
        author: userId,
        title: title || `${genre} Story ${Date.now()}`,
        content: "",
        genre: genre || "General",
        currentProgress: "beginning",
      });
      await story.save();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(story),
    };
  } catch (error) {
    console.error("Get or create story error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while getting or creating the story.",
      }),
    };
  }
};

const createStory = async (event) => {
  try {
    // Retrieve user ID from the event
    const userResponse = await getCurrentUser(event);

    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    // Parse and validate the input data
    let storyData = event.body;

    if (typeof storyData === "string") {
      try {
        storyData = JSON.parse(storyData);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    // Destructure and validate story data
    const { title, content, genre } = storyData;

    if (!title || !content || !genre) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Title, content, and genre are required",
        }),
      };
    }

    // Create a new story instance with validated data
    const newStory = new Story({
      author: userId,
      title: title,
      content: content,
      genre: genre,
    });

    // Save the story to the database
    const savedStory = await newStory.save();

    // Return success response
    return {
      statusCode: 201,
      body: JSON.stringify(savedStory),
    };
  } catch (error) {
    logger.error("Create story error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while creating the story",
      }),
    };
  }
};

const getStories = async (event) => {
  try {
    // Get current user using getCurrentUser
    const userResponse = await getCurrentUser(event);

    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    const stories = await Story.find({ author: userId });

    return {
      statusCode: 200,
      body: JSON.stringify(stories),
    };
  } catch (error) {
    logger.error("Get stories error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while fetching stories",
      }),
    };
  }
};

const getStory = async (event, storyId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized: User not authenticated",
        }),
      };
    }

    if (!storyId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid story ID" }),
      };
    }
    console.log("Story ID:", storyId);
    console.log("User ID:", userId);
    const storyObjectId =
      storyId && ObjectId.isValid(storyId) ? new ObjectId(storyId) : null;
    const userObjectId =
      userId && ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!storyObjectId || !userObjectId)
      throw new Error("Invalid Story or user ID");

    // Query the database
    const story = await Story.findOne({
      _id: storyObjectId,
      author: userObjectId,
    });
    console.log("User story:", story);
    if (!story) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Story not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(story),
    };
  } catch (error) {
    logger.error("Get story error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while fetching the story",
      }),
    };
  }
};

const updateStory = async (event, storyId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized: User not authenticated",
        }),
      };
    }

    if (!storyId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid story ID" }),
      };
    }

    let updates = event.body;
    if (typeof updates === "string") {
      try {
        updates = JSON.parse(updates);
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    const storyObjectId =
      storyId && ObjectId.isValid(storyId) ? new ObjectId(storyId) : null;
    const userObjectId =
      userId && ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!storyObjectId || !userObjectId)
      throw new Error("Invalid Story or user ID");

    // Query the database
    const story = await Story.findOneAndUpdate(
      {
        _id: storyObjectId,
        author: userObjectId,
      },
      updates,
      { new: true }
    );

    if (!story) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Outline not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(story),
    };
  } catch (error) {
    logger.error("Update story error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the story",
      }),
    };
  }
};

const deleteStory = async (event, storyId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized: User not authenticated",
        }),
      };
    }

    if (!storyId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid outline ID" }),
      };
    }
    const storyObjectId =
      storyId && ObjectId.isValid(storyId) ? new ObjectId(storyId) : null;
    const userObjectId =
      userId && ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!storyObjectId || !userObjectId)
      throw new Error("Invalid Story or user ID");

    const story = await Story.findOneAndDelete({
      _id: storyObjectId,
      author: userObjectId,
    });

    if (!story) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Outline not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Story deleted successfully" }),
    };
  } catch (error) {
    logger.error("Delete story error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the story",
      }),
    };
  }
};

const updateStoryContent = async (event) => {
  try {
    const userId = await verifyToken(event);
    const storyId = event.path.split("/").pop();
    const { content } = JSON.parse(event.body);

    const story = await Story.findOneAndUpdate(
      { _id: storyId, author: userId },
      { $set: { content } },
      { new: true }
    );

    if (!story) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Story not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Story content updated successfully",
        story,
      }),
    };
  } catch (error) {
    logger.error("Update story content error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the story content",
      }),
    };
  }
};

// AI endpoints
const generateAndSaveStoryPrompt = async (event) => {
  try {
    // Parse the event body
    const body =
      typeof event === "string"
        ? JSON.parse(event)
        : event.body
        ? JSON.parse(event.body)
        : event;

    // Destructure parameters
    const { genre, writingStyle, complexity, targetAudience } = body;

    // Validate parameters
    if (!genre || !writingStyle || !complexity || !targetAudience) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required parameters",
          receivedBody: body,
        }),
      };
    }

    // Get current user with full event context
    const userResponse = await getCurrentUser(event);

    // Parse user response
    let user;
    try {
      // Since userResponse might already be a parsed object or a JSON string
      user =
        typeof userResponse === "string"
          ? JSON.parse(userResponse).user
          : userResponse.body
          ? JSON.parse(userResponse.body).user
          : userResponse.user;
    } catch (parseError) {
      console.error("Error parsing user response:", parseError);
      console.error("Unparsed user response:", userResponse);
      throw new Error("Failed to parse user data");
    }

    // Verify user ID exists
    if (!user || !user.id) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "User authentication failed",
          userResponse: userResponse,
        }),
      };
    }

    // Generate story prompt
    const prompt = await generateStoryPrompt({
      genre,
      writingStyle,
      complexity,
      targetAudience,
    });

    // Create new story
    const story = new Story({
      author: user.id,
      title: `${genre} Story ${Date.now()}`,
      genre,
      content: prompt,
      complexity,
      targetAudience,
      writingStyle,
      status: "Draft",
    });

    // Save the story
    await story.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        data: {
          prompt,
          storyId: story._id,
          title: story.title,
        },
      }),
    };
  } catch (error) {
    console.error("Detailed error in generateAndSaveStoryPrompt:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        status: "error",
        message:
          error.message ||
          "An error occurred while generating the story prompt",
        errorStack: error.stack,
      }),
    };
  }
};

const generatePrompt = async (event) => {
  try {
    const userResponse = await getCurrentUser(event);
    console.log("User response:", userResponse);

    if (userResponse.statusCode !== 200) {
      return userResponse; // Return the error response from getCurrentUser
    }

    const user = JSON.parse(userResponse.body).user;
    console.log("User:", user);

    const { genre } = JSON.parse(event.body);
    console.log("Genre:", genre);

    // Use getOrCreateStory to retrieve or create a story
    const storyResponse = await getOrCreateStory({
      body: JSON.stringify({
        userId: user.id,
        title: `${genre || "General"} Story`,
        genre: genre || "General",
      }),
    });

    if (storyResponse.statusCode !== 200) {
      console.error("Error getting or creating story:", storyResponse);
      return storyResponse;
    }

    const story = JSON.parse(storyResponse.body);
    console.log("Story:", story);

    const prompt = `Generate a writing prompt for a ${
      user.writingMode || "beginner"
    } writer working on a ${
      story.genre
    } story. The story is currently at the following point: ${
      story.currentProgress || "beginning"
    }. Consider the user's preferences: ${
      user.preferences?.join(", ") || "None specified"
    }.`;

    console.log("Generated prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    const generatedPrompt = completion.choices[0].message.content.trim();
    console.log("AI response:", generatedPrompt);

    // Update the story with the new prompt
    story.currentProgress = generatedPrompt;
    await Story.findByIdAndUpdate(story._id, {
      currentProgress: generatedPrompt,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        prompt: generatedPrompt,
        storyId: story._id,
        storyTitle: story.title,
        storyGenre: story.genre,
      }),
    };
  } catch (error) {
    console.error("Error generating prompt:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message:
          error.message || "An error occurred while generating the prompt",
      }),
    };
  }
};

const conversationInteractions = async (event) => {
  try {
    const userResponse = await getCurrentUser(event);
    console.log("User response:", userResponse);

    if (userResponse.statusCode !== 200) {
      return userResponse;
    }

    const { message } = JSON.parse(event.body);
      const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const aiResponse = completion.choices[0].message.content.trim();
    console.log("AI response:", aiResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: aiResponse
      }),
    }
  } catch (error) {
    console.error("Error generating conversation interactions:", error);
  }
};

const generateGuidance = async (event) => {
  try {
    // Parse the event body
    const body =
      typeof event === "string"
        ? JSON.parse(event)
        : event.body
        ? JSON.parse(event.body)
        : event;

    // Destructure parameters
    const { genre, currentContent } = body;

    // Validate parameters
    if (!genre || !currentContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required parameters",
          receivedBody: body,
        }),
      };
    }

    // Get current user with full event context
    const userResponse = await getCurrentUser(event);

    // Parse user response
    let user;
    try {
      // Since userResponse might already be a parsed object or a JSON string
      user =
        typeof userResponse === "string"
          ? JSON.parse(userResponse).user
          : userResponse.body
          ? JSON.parse(userResponse.body).user
          : userResponse.user;
    } catch (parseError) {
      console.error("Error parsing user response:", parseError);
      console.error("Unparsed user response:", userResponse);
      throw new Error("Failed to parse user data");
    }

    // Verify user ID exists
    if (!user || !user.id) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "User authentication failed",
          userResponse: userResponse,
        }),
      };
    }

    // Get or create story
    const storyResponse = await getOrCreateStory({
      body: JSON.stringify({
        userId: user.id,
        title: `${genre} Story`,
        genre: genre,
      }),
    });

    if (storyResponse.statusCode !== 200) {
      console.error("Error getting or creating story:", storyResponse);
      return storyResponse;
    }

    const story = JSON.parse(storyResponse.body);

    // Generate guidance prompt
    const prompt = `Provide writing guidance for a ${
      user.writingMode || "beginner"
    } writer working on a ${
      story.genre
    } story. The current content is: "${currentContent}". Consider the user's preferences: ${
      user.preferences?.join(", ") || "None specified"
    }. Provide suggestions for improvement and next steps.`;

    console.log("Generated prompt:", prompt);

    // Generate guidance using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const generatedGuidance = completion.choices[0].message.content.trim();
    console.log("AI response:", generatedGuidance);

    // For now, we'll skip the guidance quality analysis
    // const guidanceQuality = await analyzeGuidanceQuality(generatedGuidance, user.preferences, story.genre);

    return {
      statusCode: 200,
      body: JSON.stringify({
        guidance: generatedGuidance,
        // quality: guidanceQuality,
        storyId: story._id,
      }),
    };
  } catch (error) {
    console.error("Error generating guidance:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while generating guidance",
        errorStack: error.stack,
      }),
    };
  }
};

const submitFeedback = async (event) => {
  try {
    // Debugging: log the event to check if it's structured correctly
    console.log("Event received:", event);

    // Get the current user
    const userResponse = await getCurrentUser(event);
    console.log("User response:", userResponse);

    if (userResponse.statusCode !== 200) {
      return userResponse; // Return the error response from getCurrentUser
    }

    const user = JSON.parse(userResponse.body).user;
    console.log("User:", user);

    // Parse the feedback data from the event body
    const { storyId, promptId, guidanceId, rating, comments } = JSON.parse(
      event.body
    );
    console.log("Feedback data:", {
      storyId,
      promptId,
      guidanceId,
      rating,
      comments,
    });

    // Get or create the story for the user
    console.log("Calling getOrCreateStory with user ID:", user.id);
    const storyResponse = await getOrCreateStory({
      body: JSON.stringify({
        userId: user.id,
        title: `Story ${storyId}`, // Assuming a title format for the story; adjust as needed
        genre: "General", // You can add logic here to retrieve genre if necessary
      }),
    });

    if (storyResponse.statusCode !== 200) {
      console.error("Error getting or creating story:", storyResponse);
      return storyResponse;
    }

    const story = JSON.parse(storyResponse.body);
    console.log("Story:", story);

    // Ensure the story ID matches
    if (story._id !== storyId) {
      console.error("Story ID mismatch:", story._id, storyId);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Story ID mismatch" }),
      };
    }

    // Debugging: log the feedback object before saving
    console.log("Creating feedback object:", {
      user: user.id,
      story: storyId,
      prompt: promptId,
      guidance: guidanceId,
      rating,
      comments,
    });

    // Create and save the feedback
    const feedback = new Feedback({
      user: user.id,
      story: storyId,
      prompt: promptId,
      guidance: guidanceId,
      rating,
      comments,
    });

    console.log("Saving feedback...");
    await feedback.save();
    console.log("Feedback saved:", feedback);

    // Debugging: confirm if AI parameters adjustment function exists
    console.log("Adjusting AI parameters with feedback...");
    if (typeof adjustAIParameters !== "function") {
      console.error("Error: adjustAIParameters function not found!");
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error: adjustAIParameters function not found",
        }),
      };
    }

    await adjustAIParameters(feedback);
    console.log("AI parameters adjusted.");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback submitted successfully" }),
    };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while submitting feedback",
        errorStack: error.stack, // Include stack trace for more context
      }),
    };
  }
};

const dashboardAnalysis = async (data) => {
  try {
    const { userData } = data;

    // Prepare the prompt for the AI
    const prompt = `As a writing assistant, analyze the following user data and provide insights about their writing journey:
    - Recent writing activity
    - Writing patterns
    - Areas of improvement
    - Suggestions for growth

    User Data: ${JSON.stringify(userData)}`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a specialized writing coach focused on helping writers improve their craft through data analysis and personalized feedback.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        analysis: completion.choices[0].message.content,
        success: true,
      }),
    };
  } catch (error) {
    logger.error("Dashboard AI Analysis error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing dashboard analysis",
        success: false,
      }),
    };
  }
};

// deck endpoints
const createDeck = async (event) => {
  try {
    // Get current user using getCurrentUser
    const userResponse = await getCurrentUser(event);

    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    // Robust body parsing
    let deckData = event.body;

    // If body is a string, parse it
    if (typeof deckData === "string") {
      try {
        deckData = JSON.parse(deckData);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    const { name } = deckData;

    // Validate name
    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Deck name is required" }),
      };
    }

    // Create new deck
    const newDeck = new Deck({ userId, name });
    await newDeck.save();

    return {
      statusCode: 201,
      body: JSON.stringify(newDeck),
    };
  } catch (error) {
    logger.error("Create deck error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while creating the deck",
      }),
    };
  }
};

const getUserDecks = async (event) => {
  try {
    // Get current user using getCurrentUser
    const userResponse = await getCurrentUser(event);

    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    // Fetch decks for the user
    const decks = await Deck.find({ userId }).populate("cards");

    return {
      statusCode: 200,
      body: JSON.stringify(decks),
    };
  } catch (error) {
    logger.error("Get user decks error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while fetching decks",
      }),
    };
  }
};

const getDeck = async (event, deckId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    if (!deckId) throw new Error("Invalid deck ID");

    // Convert deckId and userId to ObjectId
    const deckObjectId = ObjectId.isValid(deckId) ? new ObjectId(deckId) : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!deckObjectId || !userObjectId)
      throw new Error("Invalid deck or user ID");

    // Query the database
    const deck = await Deck.findOne({
      _id: deckObjectId,
      userId: userObjectId,
    });
    if (!deck) throw new Error("Deck not found");

    return {
      statusCode: 200,
      body: JSON.stringify(deck),
    };
  } catch (error) {
    logger.error(`Get deck error: ${error.message}`);
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "fail",
        message: error.message,
      }),
    };
  }
};

const updateDeck = async (event) => {
  try {
    // Get the current user
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    const deckId = extractDeckId(event);

    // Validate deck ID
    if (!deckId || !deckId.match(/^[a-fA-F0-9]{24}$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid or missing deck ID" }),
      };
    }

    // Parse updates from request body
    let updates = event.body;
    if (typeof updates === "string") {
      try {
        updates = JSON.parse(updates);
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    // Validate the user's permission to edit the deck
    validateDeckOperation(userId, deckId, "edit");

    // Update the deck
    const deck = await Deck.findOneAndUpdate({ _id: deckId, userId }, updates, {
      new: true,
    });

    if (!deck) throw new AppError("Deck not found", 404);

    return {
      statusCode: 200,
      body: JSON.stringify(deck),
    };
  } catch (error) {
    return handleError(error);
  }
};

const deleteDeck = async (event) => {
  try {
    // Get the current user
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    const deckId = extractDeckId(event);

    // Validate deck ID
    if (!deckId || !deckId.match(/^[a-fA-F0-9]{24}$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid or missing deck ID" }),
      };
    }

    // Log the delete operation
    logger.info(`Deleting deck: userId=${userId}, deckId=${deckId}`);

    // Validate the user's permission to delete the deck
    validateDeckOperation(userId, deckId, "delete");

    // Delete the deck
    const deck = await Deck.findOneAndDelete({ _id: deckId, userId });

    if (!deck) throw new AppError("Deck not found", 404);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Deck deleted successfully" }),
    };
  } catch (error) {
    return handleError(error);
  }
};

// card endpoints
const generateCard = async (event, userId) => {
  try {
    let card = event.body;

    // If body is a string, parse it
    if (typeof card === "string") {
      try {
        card = JSON.parse(card);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    const cardType = card.cardType;

    validateCardType(cardType);

    const prompt = `Generate a ${cardType} card for a deck-building story game.`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
    });

    const cardContent = response.choices[0].message.content.trim();
    const newCard = new Card({
      userId,
      type: cardType,
      content: cardContent,
    });
    await newCard.save();

    return {
      statusCode: 201,
      body: JSON.stringify(newCard),
    };
  } catch (error) {
    logger.error("Generate card error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while generating the card",
      }),
    };
  }
};

const customizeCard = async (event, userId, cardId) => {
  try {
    let customization = event.body;

    // If body is a string, parse it
    if (typeof customization === "string") {
      try {
        customization = JSON.parse(customization);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    validateCustomization(customization);

    const card = await Card.findOneAndUpdate(
      { _id: cardId, userId },
      { $set: { customization } },
      { new: true }
    );

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(card),
    };
  } catch (error) {
    logger.error("Customize card error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message:
          error.message || "An error occurred while customizing the card",
      }),
    };
  }
};

const setCardRarity = async (event, userId, cardId) => {
  try {
    let rarityData = event.body;

    // If body is a string, parse it
    if (typeof rarityData === "string") {
      try {
        rarityData = JSON.parse(rarityData);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    const { rarity } = rarityData;
    validateRarity(rarity);

    const card = await Card.findOneAndUpdate(
      { _id: cardId, userId },
      { $set: { rarity } },
      { new: true }
    );

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(card),
    };
  } catch (error) {
    logger.error("Set card rarity error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while setting card rarity",
      }),
    };
  }
};

const integrateCardIntoStory = async (event, userId, cardId) => {
  try {
    let storyData = event.body;

    // If body is a string, parse it
    if (typeof storyData === "string") {
      try {
        storyData = JSON.parse(storyData);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    const { storyId } = storyData;

    // Validate inputs
    validateStoryIntegration(userId, storyId, cardId);

    // Find story and card, log details for debugging
    const story = await Story.findOne({ _id: storyId, author: userId });

    const card = await Card.findById(cardId);
    console.log("Found Card:", card ? card._id : "Not Found");

    if (!story) {
      console.log("Story not found details:", {
        storyId,
        userId,
        searchCriteria: { _id: storyId, author: userId },
      });
      throw new AppError("Story not found", 404);
    }

    if (!card) {
      console.log("Card not found details:", { cardId });
      throw new AppError("Card not found", 404);
    }

    // Check if card is already integrated
    if (story.integratedCards.includes(cardId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Card already integrated into this story",
        }),
      };
    }

    story.content += `\n\n[Card Integration: ${card.content}]`;
    story.integratedCards.push(cardId);

    // Save and log the result
    const savedStory = await story.save();

    return {
      statusCode: 200,
      body: JSON.stringify(savedStory),
    };
  } catch (error) {
    console.error("Full Integrate card into story error:", error);
    logger.error("Integrate card into story error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message:
          error.message ||
          "An error occurred while integrating the card into the story",
      }),
    };
  }
};

const getCard = async (event, userId, cardId) => {
  try {
    const card = await Card.findOne({ _id: cardId, userId });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(card),
    };
  } catch (error) {
    logger.error("Get card error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while fetching the card",
      }),
    };
  }
};

const deleteCard = async (event, userId, cardId) => {
  try {
    const card = await Card.findOneAndDelete({ _id: cardId, userId });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Card deleted successfully" }),
    };
  } catch (error) {
    logger.error("Delete card error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: error.message || "An error occurred while deleting the card",
      }),
    };
  }
};

// outline endpoints
const createOutline = async (event) => {
  try {
    // Retrieve user ID from the event
    const userResponse = await getCurrentUser(event);

    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    // Parse and validate the input data
    let outlineData = event.body;

    if (typeof outlineData === "string") {
      try {
        outlineData = JSON.parse(outlineData);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    // Add userId to the outline data for validation
    const validationResult = validateOutline({
      ...outlineData,
      userId,
    });

    // Ensure necessary fields are present
    const { title, sections } = validationResult;
    if (!title || !sections || !Array.isArray(sections)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Title and sections (array) are required",
        }),
      };
    }

    // Create a new Outline instance with validated data
    const newOutline = new Outline({
      userId,
      title: validationResult.title,
      type: validationResult.type || "plotter",
      sections: validationResult.sections.map((section) => ({
        ...section,
        id: section.id || uuidv4(), // Ensure ID exists
        children: section.children || [],
      })),
    });

    // Save the outline to the database
    const savedOutline = await newOutline.save();

    // Return the newly created outline as a response
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Outline created successfully",
        outline: savedOutline.toObject(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while creating the outline",
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

const getAllOutlines = async (event) => {
  try {
    // Get current user using getCurrentUser
    const userResponse = await getCurrentUser(event);

    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    const outlines = await Outline.find({ userId });

    return {
      statusCode: 200,
      body: JSON.stringify(outlines),
    };
  } catch (error) {
    logger.error("Get all outlines error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while fetching outlines",
        error: error.message,
      }),
    };
  }
};

const getOutline = async (event, outlineId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized: User not authenticated",
        }),
      };
    }

    if (!outlineId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid outline ID" }),
      };
    }
    const outlineObjectId = ObjectId.isValid(outlineId)
      ? new ObjectId(outlineId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    console.log(outlineObjectId, userObjectId);
    if (!outlineObjectId || !userObjectId)
      throw new Error("Invalid outline or user ID");

    // Query the database
    const outline = await Outline.findOne({
      _id: outlineObjectId,
      userId: userObjectId,
    });

    if (!outline) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Outline not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(outline),
    };
  } catch (error) {
    logger.error("Get outline error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while fetching the outline",
        error: error.message,
      }),
    };
  }
};

const updateOutline = async (event, outlineId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized: User not authenticated",
        }),
      };
    }

    if (!outlineId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid outline ID" }),
      };
    }

    let updates = event.body;
    if (typeof updates === "string") {
      try {
        updates = JSON.parse(updates);
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    const { error } = validateOutline(updates);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const outlineObjectId = ObjectId.isValid(outlineId)
      ? new ObjectId(outlineId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!outlineObjectId || !userObjectId)
      throw new Error("Invalid outline or user ID");

    // Query the database
    const outline = await Outline.findOneAndUpdate(
      {
        _id: outlineObjectId,
        userId: userObjectId,
      },
      updates,
      { new: true }
    );

    if (!outline) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Outline not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(outline),
    };
  } catch (error) {
    logger.error("Update outline error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the outline",
        error: error.message,
      }),
    };
  }
};

const deleteOutline = async (event, outlineId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized: User not authenticated",
        }),
      };
    }

    if (!outlineId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid outline ID" }),
      };
    }
    const outlineObjectId = ObjectId.isValid(outlineId)
      ? new ObjectId(outlineId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!outlineObjectId || !userObjectId)
      throw new Error("Invalid deck or user ID");

    const outline = await Outline.findOneAndDelete({
      _id: outlineObjectId,
      userId: userObjectId,
    });

    if (!outline) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Outline not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Outline deleted successfully" }),
    };
  } catch (error) {
    logger.error("Delete outline error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the outline",
        error: error.message,
      }),
    };
  }
};

// storymap endpoints
const createStoryMap = async (event) => {
  try {
    // Get current user using getCurrentUser
    const userResponse = await getCurrentUser(event);
    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    // Parse and validate the input data
    let storyMapData = event.body;

    // If body is a string, parse it
    if (typeof storyMapData === "string") {
      try {
        storyMapData = JSON.parse(storyMapData);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    // Validate the story map data using Joi (or another validation method)
    const { error } = validateStoryMap(storyMapData);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    // Ensure necessary fields are present in the request data
    const { title, description, elements } = storyMapData;
    if (!title || !description || !elements) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Title, description, and elements are required",
        }),
      };
    }

    // Create a new StoryMap instance with userId and the story map data
    const newStoryMap = new StoryMap({
      title,
      description,
      elements,
      userId, // Attach the userId here
    });

    // Save the story map to the database
    await newStoryMap.save();

    // Return the newly created story map as a response
    return {
      statusCode: 201,
      body: JSON.stringify(newStoryMap),
    };
  } catch (error) {
    logger.error("Create story map error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while creating the story map",
      }),
    };
  }
};

const getStoryMap = async (event, storyMapId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;

    if (!storyMapId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid storyMap ID" }),
      };
    }

    const storyMapObjectId = ObjectId.isValid(storyMapId)
      ? new ObjectId(storyMapId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!storyMapObjectId || !userObjectId) {
      throw new Error("Invalid story map or user ID");
    }

    const storyMap = await StoryMap.findOne({
      _id: storyMapObjectId,
      userId: userObjectId,
    });

    if (!storyMap) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Story map not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(storyMap),
    };
  } catch (error) {
    logger.error("Get story map error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while fetching the story map",
      }),
    };
  }
};

const updateStoryMap = async (event, storyMapId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;

    if (!storyMapId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid storyMap ID" }),
      };
    }
    const storyMapObjectId = ObjectId.isValid(storyMapId)
      ? new ObjectId(storyMapId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!storyMapObjectId || !userObjectId)
      throw new Error("Invalid outline or user ID");

    const updates = event.body;
    const { error } = validateStoryMap(updates);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const storyMap = await StoryMap.findOneAndUpdate(
      { _id: storyMapObjectId, userId: userObjectId },
      updates,
      { new: true }
    );

    if (!storyMap) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Story map not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(storyMap),
    };
  } catch (error) {
    logger.error("Update story map error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the story map",
      }),
    };
  }
};

const deleteStoryMap = async (event, storyMapId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;

    if (!storyMapId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid storyMap ID" }),
      };
    }
    const storyMapObjectId = ObjectId.isValid(storyMapId)
      ? new ObjectId(storyMapId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!storyMapObjectId || !userObjectId)
      throw new Error("Invalid outline or user ID");

    const storyMap = await StoryMap.findOneAndDelete({
      _id: storyMapObjectId,
      userId: userObjectId,
    });

    if (!storyMap) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Story map not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Story map deleted successfully" }),
    };
  } catch (error) {
    logger.error("Delete story map error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the story map",
      }),
    };
  }
};

const getAIFeedback = async (data) => {
  try {
    const { error } = validateAIFeedbackRequest(data);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const feedback = await generateAIFeedback(
      data.text,
      data.genre,
      data.style
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ feedback }),
    };
  } catch (error) {
    logger.error("Get AI feedback error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while generating AI feedback",
      }),
    };
  }
};

// writing endpoints
const createWritingSession = async (event) => {
  try {
    // Retrieve user ID from the event
    const userResponse = await getCurrentUser(event);

    // Check if user retrieval was successful
    if (userResponse.statusCode !== 200) {
      return userResponse; // Return error if user retrieval failed
    }

    // Parse user ID from the response
    const userId = JSON.parse(userResponse.body).user.id;

    // Parse and validate the input data
    let sessionData = event.body;

    if (typeof sessionData === "string") {
      try {
        sessionData = JSON.parse(sessionData);
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid JSON in request body" }),
        };
      }
    }

    // Validate the writing session data using Joi (or another validation method)
    const { error } = validateWritingSession(sessionData);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    // Ensure necessary fields are present in the request data
    const { title, content, duration, wordCount } = sessionData;
    if (!title || !content || !duration || !wordCount) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Title, content, duration, and wordCount are required",
        }),
      };
    }

    // Create a new WritingSession instance with userId and session data
    const newSession = new WritingSession({
      title,
      content,
      duration,
      wordCount,
      userId,
    });

    // Save the writing session to the database
    await newSession.save();

    // Return the newly created writing session as a response
    return {
      statusCode: 201,
      body: JSON.stringify(newSession),
    };
  } catch (error) {
    logger.error("Create writing session error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while creating the writing session",
      }),
    };
  }
};

const getWritingSession = async (event, writtingId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;

    if (!writtingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid writtingId " }),
      };
    }

    const writtingObjectId = ObjectId.isValid(writtingId)
      ? new ObjectId(writtingId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!writtingObjectId || !userObjectId) {
      throw new Error("Invalid story map or user ID");
    }

    const session = await WritingSession.findOne({
      _id: writtingObjectId,
      userId: userObjectId,
    });

    if (!session) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "writting not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(session),
    };
  } catch (error) {
    logger.error("Get writing session error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while fetching the writing session",
      }),
    };
  }
};

const updateWritingSession = async (event, writtingId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;

    if (!writtingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid writting ID" }),
      };
    }

    const writtingObjectId = ObjectId.isValid(writtingId)
      ? new ObjectId(writtingId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!writtingObjectId || !userObjectId) {
      throw new Error("Invalid writting id or user ID");
    }

    const updates = event.body;
    const { error } = validateWritingSession(updates);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error.details[0].message }),
      };
    }

    const session = await WritingSession.findOneAndUpdate(
      { _id: writtingObjectId, userId: userObjectId },
      updates,
      { new: true }
    );

    if (!session) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Writing session not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(session),
    };
  } catch (error) {
    logger.error("Update writing session error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the writing session",
      }),
    };
  }
};

const deleteWritingSession = async (event, writtingId) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const userId = JSON.parse(userResponse.body).user.id;

    if (!writtingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid writtingId " }),
      };
    }

    const writtingObjectId = ObjectId.isValid(writtingId)
      ? new ObjectId(writtingId)
      : null;
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    if (!writtingObjectId || !userObjectId) {
      throw new Error("Invalid writtingId or user ID");
    }

    const session = await WritingSession.Delete({
      _id: writtingObjectId,
      userId: userObjectId,
    });

    if (!session) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Writing session not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Writing session deleted successfully" }),
    };
  } catch (error) {
    logger.error("Delete writing session error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the writing session",
      }),
    };
  }
};

const getWritingGuidance = async (data) => {
  try {
    const { currentContent, genre, writingMode } = data;

    if (!currentContent || !genre || !writingMode) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const guidance = await aiService.generateWritingGuidance(
      currentContent,
      genre,
      writingMode
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ guidance }),
    };
  } catch (error) {
    logger.error("Get writing guidance error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while generating writing guidance",
      }),
    };
  }
};

const subscribeToNotificationsHandler = async (event) => {
  try {
    const { subscription } = JSON.parse(event.body);

    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const user = JSON.parse(userResponse.body).user;
    const userObjectId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;

    if (!userObjectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid user ID format" }),
      };
    }

    // Update both FCM token and push subscription
    await User.findByIdAndUpdate(userObjectId, {
      fcmToken: subscription.fcmToken,
      pushSubscription: subscription,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully subscribed to push notifications",
      }),
    };
  } catch (error) {
    logger.error("Error subscribing to push notifications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error subscribing to push notifications",
        error: error.message,
      }),
    };
  }
};

const sendEmailNotificationHandler = async (event) => {
  try {
    const { subject, text } = event.body.data;

    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const user = JSON.parse(userResponse.body).user;
    const userObjectId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;

    if (!userObjectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid user ID format" }),
      };
    }

    await sendEmailNotification(userObjectId, subject, text);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email notification sent successfully" }),
    };
  } catch (error) {
    logger.error("Error sending email notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error sending email notification",
        error: error.message 
      }),
    };
  }
};

const sendPushNotificationHandler = async (event) => {
  try {
    const { title, body } = event.body.data;
    
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;
    
    const user = JSON.parse(userResponse.body).user;
    
    if (!user.fcmToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User has no FCM token registered" }),
      };
    }

    // Send push notification using fcmToken directly from user object
    const message = {
      notification: { title, body },
      token: user.fcmToken
    };

    await admin.messaging().send(message);
    logger.info(`Push notification sent to user ${user.id}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Push notification sent successfully" }),
    };
  } catch (error) {
    logger.error("Error sending push notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error sending push notification", 
        error: error.message 
      }),
    };
  }
};

const awardPointsHandler = async (event) => {
  try {
    const { rewardType } = event.body.data;
    
    const validRewardTypes = ['DAILY_LOGIN', 'STORY_COMPLETION', 'WRITING_STREAK'];
    if (!validRewardTypes.includes(rewardType)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: "Invalid reward type",
          validTypes: validRewardTypes
        }),
      };
    }
    
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;
    
    const user = JSON.parse(userResponse.body).user;
    const userObjectId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;
    
    if (!userObjectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid user ID format" }),
      };
    }

    const updatedRewards = await awardPoints(userObjectId, rewardType);
    
    // Send push notification if user has FCM token
    if (user.fcmToken) {
      const message = {
        notification: {
          title: 'Points Awarded!',
          body: `You've earned points for: ${rewardType}`
        },
        token: user.fcmToken
      };
      await admin.messaging().send(message);
    }
    
    await checkAndAwardBadge(userObjectId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Points awarded successfully",
        rewards: updatedRewards,
      }),
    };
  } catch (error) {
    logger.error("Error awarding points:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error awarding points",
        error: error.message 
      }),
    };
  }
};

const getUserRewardsHandler = async (event) => {
  try {
    const userResponse = await getCurrentUser(event);
    if (userResponse.statusCode !== 200) return userResponse;

    const user = JSON.parse(userResponse.body).user;
    const userObjectId = ObjectId.isValid(user.id) ? new ObjectId(user.id) : null;

    if (!userObjectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid user ID format" }),
      };
    }

    const userWithRewards = await User.findById(userObjectId).select("rewards");

    if (!userWithRewards) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ rewards: userWithRewards.rewards }),
    };
  } catch (error) {
    logger.error("Error fetching user rewards:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error fetching user rewards",
        error: error.message 
      }),
    };
  }
};

// Normalize paths to remove trailing slashes
const normalizePath = (path) => path.replace(/\/+$/, "");

// Extract deck ID from path parameters or path directly
const extractDeckId = (event) => {
  const path = event.path.replace(/\/$/, ""); // Normalize path (remove trailing slash)
  const segments = path.split("/"); // Split path into segments
  return segments[segments.length - 1]; // Return the last segment as the ID
};

const extractCardId = (path) => {
  const pathParts = path.split("/").filter((part) => part !== "");
  console.log("Path parts:", pathParts);

  // If the path is a single card ID, return it directly
  if (pathParts.length === 1 && pathParts[0].length === 24) {
    return pathParts[0];
  }

  // Check if the path includes 'cards'
  const cardsIndex = pathParts.indexOf("cards");
  if (cardsIndex !== -1 && pathParts.length > cardsIndex + 1) {
    return pathParts[cardsIndex + 1];
  }

  // If 'cards' is not in the path, return the last part
  return pathParts[pathParts.length - 1];
};

// Centralized error handler
const handleError = (error) => {
  logger.error("Error:", error.stack || error.toString());
  return {
    statusCode: error.statusCode || 500,
    body: JSON.stringify({
      message: error.message || "An internal server error occurred",
      details: error.stack || error.toString(),
    }),
  };
};

module.exports = {
  handleUserRoutes,
  handleAIRoutes,
  handleStoryRoutes,
  handleDeckRoutes,
  handleCardRoutes,
  handleOutlineRoutes,
  handleStoryMappingRoutes,
  handleWritingEnvironmentRoutes,
  handleNotificationRoutes,
};
