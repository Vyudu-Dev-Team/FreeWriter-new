
const User = require("../models/User.js");
const Story = require("../models/story.js");
const Profile = require('../models/Profile.js');
const crypto = require("crypto");
const { verifyToken, generateToken, verifyEmailToken } = require("../utils/jwt.js");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/sendEmail.js");
const {
  updatePreferences,
  getPreferences,
  resetPreferences,
} from "../services/preferencesService.js";
import {
  validateCardType,
  validateCustomization,
  validateRarity,
  validateDeckOperation,
  validateStoryIntegration
} from "../utils/validators.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import OpenAI from 'openai';
import logger from '../utils/logger.js';

const openai = new OpenAI(process.env.OPENAI_API_KEY);


export const handleUserRoutes = async (event) => {
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
      response = await resendVerification(JSON.parse(event.body));
    case "GET /preferences":
      return getUserPreferences(event);
    case "PUT /preferences":
      return updateUserPreferences(event);
    case "POST /reset-preferences":
      return resetUserPreferences(event);
    default:
      return { statusCode: 404, body: { message: "Not Found" } };
  }
};

const getCurrentUser = async (event) => {
  try {
    const token = event.headers.authorization?.split(" ")[1];
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
  const { username, email, password, writingMode } = userData;

  if (!username || !email || !password) {
    throw new AppError("Please provide all required fields", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const user = new User({ username, email, password, writingMode });
  await user.save();

  const verificationToken = generateToken({ userId: user._id }, "1d");
  logger.info("Generated Verification Token:", verificationToken);
  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (emailError) {
    logger.error("Failed to send verification email:", emailError);
    throw new AppError("Failed to send verification email", 500);
  }

  return {
    statusCode: 201,
    body: {
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: { id: user._id, username: user.username, email: user.email },
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

// Updated version of the updateUserProfile function in routeHandlers.js
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

/**
 * Resends the email verification token to a user
 * @param {Object} params - The request parameters
 * @param {string} params.email - The email address of the user
 * @returns {Promise<Object>} Response object with status code and message
 */
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
    const userId = await verifyToken(event); // Assuming this retrieves the user ID
    const { preferences } = JSON.parse(event.body); // Ensure this is a valid JSON string

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

export const handleAIRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/ai", "");

  switch (`${httpMethod} ${route}`) {
    case "POST /prompt":
      return handlePromptInteraction(JSON.parse(event.body));
    case "POST /generate-prompt":
      return generatePrompt(JSON.parse(event.body));
    case "POST /generate-guidance":
      return generateGuidance(JSON.parse(event.body));
    case "POST /submit-feedback":
      return submitFeedback(JSON.parse(event.body));
    case "POST /dashboard-analysis":
      return dashboardAnalysis(JSON.parse(event.body));
    default:
      return { statusCode: 404, body: { message: "Not Found" } };
  }
};

const handlePromptInteraction = async (data) => {
  try {
    const openai = getOpenAIInstance();
    const { input } = data;
    
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful writing assistant, focused on helping writers develop their stories and improve their writing skills." 
        },
        { role: "user", content: input }
      ],
      model: "gpt-3.5-turbo",
    });

    logger.info('AI Prompt Interaction completed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: completion.choices[0].message.content,
        success: true
      })
    };
  } catch (error) {
    logger.error('AI Prompt Interaction error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error processing AI interaction',
        success: false 
      })
    };
  }
};

const generatePrompt = async (data) => {
  try {
    const { userId, storyId } = data;
    const user = await User.findById(userId);
    const story = await Story.findById(storyId);

    if (!user || !story) {
      throw new AppError("User or Story not found", 404);
    }

    const prompt = `Generate a writing prompt for a ${
      user.writingMode
    } writer working on a ${
      story.genre
    } story. The story is currently at the following point: ${
      story.currentProgress
    }. Consider the user's preferences: ${user.preferences.join(", ")}.`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 100,
    });

    const generatedPrompt = response.data.choices[0].text.trim();
    const promptQuality = await analyzePromptQuality(
      generatedPrompt,
      user.preferences,
      story.genre
    );

    return {
      statusCode: 200,
      body: {
        prompt: generatedPrompt,
        quality: promptQuality,
      },
    };
  } catch (error) {
    logger.error("Error generating prompt:", error);
    return {
      statusCode: error.statusCode || 500,
      body: {
        message:
          error.message || "An error occurred while generating the prompt",
      },
    };
  }
};

const generateGuidance = async (data) => {
  try {
    const { userId, storyId, currentContent } = data;
    const user = await User.findById(userId);
    const story = await Story.findById(storyId);

    if (!user || !story) {
      throw new AppError("User or Story not found", 404);
    }

    const prompt = `Provide writing guidance for a ${
      user.writingMode
    } writer working on a ${
      story.genre
    } story. The current content is: "${currentContent}". Consider the user's preferences: ${user.preferences.join(
      ", "
    )}. Provide suggestions for improvement and next steps.`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 200,
    });

    const generatedGuidance = response.data.choices[0].text.trim();
    const guidanceQuality = await analyzeGuidanceQuality(
      generatedGuidance,
      user.preferences,
      story.genre
    );

    return {
      statusCode: 200,
      body: {
        guidance: generatedGuidance,
        quality: guidanceQuality,
      },
    };
  } catch (error) {
    logger.error("Error generating guidance:", error);
    return {
      statusCode: error.statusCode || 500,
      body: {
        message: error.message || "An error occurred while generating guidance",
      },
    };
  }
};

const submitFeedback = async (data) => {
  try {
    const { userId, storyId, promptId, guidanceId, rating, comments } = data;

    const feedback = new Feedback({
      user: userId,
      story: storyId,
      prompt: promptId,
      guidance: guidanceId,
      rating,
      comments,
    });

    await feedback.save();

    // Analyze feedback and adjust AI parameters
    await adjustAIParameters(feedback);

    return {
      statusCode: 200,
      body: { message: "Feedback submitted successfully" },
    };
  } catch (error) {
    logger.error("Error submitting feedback:", error);
    return {
      statusCode: error.statusCode || 500,
      body: {
        message: error.message || "An error occurred while submitting feedback",
      },
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
          content: "You are a specialized writing coach focused on helping writers improve their craft through data analysis and personalized feedback." 
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        analysis: completion.choices[0].message.content,
        success: true
      })
    };
  } catch (error) {
    logger.error('Dashboard AI Analysis error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error processing dashboard analysis',
        success: false 
      })
    };
  }
};

export const handleDeckRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/decks", "");

  switch (`${httpMethod} ${route}`) {
    case "GET /":
      return getUserDecks(event);
    case "POST /":
      return createDeck(JSON.parse(event.body));
    case "GET /:id":
      return getDeck(event);
    case "PUT /:id":
      return updateDeck(event);
    case "DELETE /:id":
      return deleteDeck(event);
    default:
      return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };
  }
};

export const handleCardRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/cards", "");

  switch (`${httpMethod} ${route}`) {
    case "POST /generate":
      return generateCard(JSON.parse(event.body));
    case "PUT /:id/customize":
      return customizeCard(event);
    case "PUT /:id/rarity":
      return setCardRarity(event);
    case "POST /:id/integrate":
      return integrateCardIntoStory(event);
    default:
      return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };
  }
};

const getUserDecks = async (event) => {
  try {
    const userId = await verifyToken(event);
    const decks = await Deck.find({ userId }).populate('cards');
    return {
      statusCode: 200,
      body: JSON.stringify(decks)
    };
  } catch (error) {
    logger.error("Get user decks error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while fetching decks" })
    };
  }
};

const createDeck = async (data) => {
  try {
    const { userId, name } = data;
    const newDeck = new Deck({ userId, name });
    await newDeck.save();
    return {
      statusCode: 201,
      body: JSON.stringify(newDeck)
    };
  } catch (error) {
    logger.error("Create deck error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while creating the deck" })
    };
  }
};

const getDeck = async (event) => {
  try {
    const userId = await verifyToken(event);
    const deckId = event.path.split('/').pop();
    validateDeckOperation(userId, deckId, 'view');
    const deck = await Deck.findOne({ _id: deckId, userId }).populate('cards');
    if (!deck) {
      throw new AppError("Deck not found", 404);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(deck)
    };
  } catch (error) {
    logger.error("Get deck error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while fetching the deck" })
    };
  }
};

const updateDeck = async (event) => {
  try {
    const userId = await verifyToken(event);
    const deckId = event.path.split('/').pop();
    const updates = JSON.parse(event.body);
    validateDeckOperation(userId, deckId, 'edit');
    const deck = await Deck.findOneAndUpdate({ _id: deckId, userId }, updates, { new: true });
    if (!deck) {
      throw new AppError("Deck not found", 404);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(deck)
    };
  } catch (error) {
    logger.error("Update deck error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while updating the deck" })
    };
  }
};

const deleteDeck = async (event) => {
  try {
    const userId = await verifyToken(event);
    const deckId = event.path.split('/').pop();
    validateDeckOperation(userId, deckId, 'edit');
    const deck = await Deck.findOneAndDelete({ _id: deckId, userId });
    if (!deck) {
      throw new AppError("Deck not found", 404);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Deck deleted successfully" })
    };
  } catch (error) {
    logger.error("Delete deck error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while deleting the deck" })
    };
  }
};

const generateCard = async (data) => {
  try {
    const { userId, cardType } = data;
    validateCardType(cardType);
    
    const prompt = `Generate a ${cardType} card for a deck-building story game.`;
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 100,
    });

    const cardContent = response.data.choices[0].text.trim();
    const newCard = new Card({
      userId,
      type: cardType,
      content: cardContent
    });
    await newCard.save();

    return {
      statusCode: 201,
      body: JSON.stringify(newCard)
    };
  } catch (error) {
    logger.error("Generate card error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while generating the card" })
    };
  }
};

const customizeCard = async (event) => {
  try {
    const userId = await verifyToken(event);
    const cardId = event.path.split('/').pop();
    const { customization } = JSON.parse(event.body);
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
      body: JSON.stringify(card)
    };
  } catch (error) {
    logger.error("Customize card error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while customizing the card" })
    };
  }
};

const setCardRarity = async (event) => {
  try {
    const userId = await verifyToken(event);
    const cardId = event.path.split('/').pop();
    const { rarity } = JSON.parse(event.body);
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
      body: JSON.stringify(card)
    };
  } catch (error) {
    logger.error("Set card rarity error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while setting card rarity" })
    };
  }
};

const integrateCardIntoStory = async (event) => {
  try {
    const userId = await verifyToken(event);
    const cardId = event.path.split('/').pop();
    const { storyId } = JSON.parse(event.body);
    validateStoryIntegration(userId, storyId, cardId);
    
    const story = await Story.findOne({ _id: storyId, userId });
    const card = await Card.findById(cardId);

    if (!story || !card) {
      throw new AppError("Story or card not found", 404);
    }

    story.content += `\n\n[Card Integration: ${card.content}]`;
    story.integratedCards.push(cardId);
    await story.save();

    return {
      statusCode: 200,
      body: JSON.stringify(story)
    };
  } catch (error) {
    logger.error("Integrate card into story error:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message || "An error occurred while integrating the card into the story" })
    };
  }
};

export const handleStoryRoutes = async (event) => {
  // Implement story-related routes here
};

module.exports = {
  handleUserRoutes,
  handleStoryRoutes,
  handleAIRoutes
};
