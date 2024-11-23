// functions/routeHandlers.js
import User from "../models/User.js";
import Story from "../models/story.js";
import crypto from "crypto";
import { verifyToken, generateToken } from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/sendEmail.js";
import {
  updatePreferences,
  getPreferences,
  resetPreferences,
} from "../services/preferencesService.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";

export const handleUserRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/users", "");

  switch (`${httpMethod} ${route}`) {
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
      return verifyEmail(event);
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
      return { statusCode: 404, body: { message: "Not Found" } };
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
  console.log("Generated Verification Token:", verificationToken);
  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (emailError) {
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
  // Extract the token from the Authorization header
  const token = event.headers.authorization?.split(" ")[1]; // Get the token part after "Bearer"

  if (!token) {
    throw new AppError("No token provided", 401);
  }

  try {
    // Verify the token and get the user ID
    const decoded = await verifyToken(token);
    const userId = decoded.userId;

    // Find the user by ID
    const user = await User.findById(userId);

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
          writingMode: user.writingMode,
        },
      }),
    };
  } catch (error) {
    throw new AppError(error.message, 401);
  }
};

const updateUserProfile = async (event) => {
  const userId = await verifyToken(event);
  const updates = JSON.parse(event.body);

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    statusCode: 200,
    body: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        writingMode: user.writingMode,
      },
    },
  };
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("No user found with that email address", 404);
  }

  const resetToken = generateToken({ userId: user._id }, "1h");
  await sendPasswordResetEmail(user.email, resetToken);

  return {
    statusCode: 200,
    body: { message: "Password reset email sent" },
  };
};

const resetPassword = async ({ token, newPassword }) => {
  const { userId } = await verifyToken(token);
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  user.password = newPassword;
  await user.save();

  return {
    statusCode: 200,
    body: { message: "Password reset successful" },
  };
};

const verifyEmail = async (event) => {
  const { token } = JSON.parse(event.body);

  if (!token) {
    throw new AppError("Verification token is required", 400);
  }

  let hashedToken;
  try {
    hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  } catch (error) {
    console.error("Error hashing token:", error);
    throw new AppError("Error processing verification token", 500);
  }

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  const jwtToken = generateToken({ userId: user._id });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Email verified successfully",
      token: jwtToken,
    }),
  };
};

const resendVerification = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("No user found with that email address", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email is already verified", 400);
  }

  const verificationToken = generateToken({ userId: user._id }, "1d");
  await sendVerificationEmail(user.email, verificationToken);

  return {
    statusCode: 200,
    body: { message: "Verification email resent" },
  };
};

const getUserPreferences = async (event) => {
  const userId = await verifyToken(event);
  const preferences = await getPreferences(userId);

  return {
    statusCode: 200,
    body: { preferences },
  };
};

const updateUserPreferences = async (event) => {
  const userId = await verifyToken(event);
  const newPreferences = JSON.parse(event.body);
  const updatedPreferences = await updatePreferences(userId, newPreferences);

  return {
    statusCode: 200,
    body: { preferences: updatedPreferences },
  };
};

const resetUserPreferences = async (event) => {
  const userId = await verifyToken(event);
  const resetPreferences = await resetPreferences(userId);

  return {
    statusCode: 200,
    body: { preferences: resetPreferences },
  };
};

export const handleAIRoutes = async (event) => {
  const { httpMethod, path } = event;
  const route = path.replace("/ai", "");

  switch (`${httpMethod} ${route}`) {
    case "POST /generate-prompt":
      return generatePrompt(JSON.parse(event.body));
    case "POST /generate-guidance":
      return generateGuidance(JSON.parse(event.body));
    case "POST /submit-feedback":
      return submitFeedback(JSON.parse(event.body));
    default:
      return { statusCode: 404, body: { message: "Not Found" } };
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
    console.error("Error generating prompt:", error);
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
    console.error("Error generating guidance:", error);
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
    console.error("Error submitting feedback:", error);
    return {
      statusCode: error.statusCode || 500,
      body: {
        message: error.message || "An error occurred while submitting feedback",
      },
    };
  }
};

export const handleStoryRoutes = async (event) => {
  // Implement story-related routes here
};
