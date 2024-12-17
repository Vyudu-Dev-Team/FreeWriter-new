const OpenAI = require( "openai");
const AppError = require( "../utils/appError.js");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a story prompt based on user preferences
 * @param {Object} params - Parameters for prompt generation
 * @param {string} params.genre - The genre of the story
 * @param {string} params.writingStyle - The preferred writing style
 * @param {string} params.complexity - The desired complexity level
 * @param {string} params.targetAudience - The target audience for the story
 * @returns {Promise<string>} The generated story prompt
 */
const generateStoryPrompt = async ({
  genre,
  writingStyle,
  complexity,
  targetAudience,
}) => {
  try {
    const prompt = `Generate a story prompt for a ${genre} story. 
    Writing style: ${writingStyle}. 
    Complexity: ${complexity}. 
    Target audience: ${targetAudience}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use a supported chat model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating story prompt:", error);
    throw new AppError("Failed to generate story prompt", 500);
  }
};

/**
 * Generate initial story guidance
 * @param {Object} params - Parameters for story guidance
 * @param {string} params.prompt - The initial story prompt
 * @returns {Promise<Object>} Object containing character, plot, and setting suggestions
 */
const generateStoryGuidance = async ({ prompt }) => {
  try {
    const guidancePrompt = `Based on the following story prompt: "${prompt}"
    1. Suggest three main characters (name and brief description).
    2. Outline three key plot points.
    3. Describe the primary setting.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: guidancePrompt }],
      max_tokens: 300,
      temperature: 0.8,
    });

    const guidance = response.choices[0].message.content.trim();

    // Safely handle response splitting
    const parts = guidance.split("\n\n");
    if (parts.length < 3) {
      throw new Error("AI response does not contain all required sections.");
    }

    const [characters, plotPoints, setting] = parts;

    return {
      characters: characters.split("\n").slice(1) || [],
      plotPoints: plotPoints.split("\n").slice(1) || [],
      setting: setting?.replace("3. ", "") || "Setting not provided.",
    };
  } catch (error) {
    console.error("Error generating story guidance:", error);
    throw new AppError("Failed to generate story guidance", 500);
  }
};

/**
 * Generates AI feedback for the given text
 * @param {string} text - The text to analyze
 * @param {string} genre - The genre of the text
 * @param {string} style - The writing style
 * @returns {string} - The generated feedback
 */
async function generateAIFeedback(text, genre, style) {
  try {
    const prompt = `As a writing assistant, provide feedback on the following ${genre} text written in ${style} style:

${text}

Please provide constructive feedback on:
1. Plot and structure
2. Character development
3. Dialogue
4. Pacing
5. Setting and atmosphere
6. Writing style and tone

Limit your response to 300 words.`;

    const response = await openai.completions.create({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 400,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    logger.error("Error generating AI feedback:", error);
    throw new Error("Failed to generate AI feedback");
  }
}

/**
 * Updates the AI model based on user input and progression
 * @param {Object} newParameters - New user input parameters (genre, writingStyle, etc.)
 * @param {string} userId - User ID for tracking progression and saving data
 * @returns {Promise<Object>} - The AI response after processing the new parameters
 */
const updateAIModel = async (newParameters, userId) => {
  try {
    // Fetch user data to understand current progress (you may customize this based on your data structure)
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if the user has existing parameters (for continuity)
    const { genre, writingStyle, complexity, targetAudience } = newParameters;

    // Generate a personalized AI prompt based on the new user parameters
    const prompt = `Generate a story prompt for a ${genre} story. 
    Writing style: ${writingStyle}. 
    Complexity: ${complexity}. 
    Target audience: ${targetAudience}.`;

    // Use OpenAI API to generate the response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiOutput = response.choices[0].message.content.trim();

    // Save the generated prompt and user progression in the database
    user.lastPrompt = aiOutput;  // Assuming you want to store the AI response for later review
    user.progression = {
      genre,
      writingStyle,
      complexity,
      targetAudience,
    };

    await user.save(); // Save user data with new AI output and progression

    // Return AI response to frontend
    return {
      prompt: aiOutput,
      progression: user.progression,
    };
  } catch (error) {
    console.error("Error updating AI model:", error);
    throw new AppError("Failed to update AI model", 500);
  }
};

module.exports = {
  generateStoryPrompt,
  generateStoryGuidance,
  updateAIModel,
};