// backend/controllers/aiController.js
import UserInput from '../models/UserInput.js';

// Function to save user input and prepare it for AI processing
export const saveAndProcessInput = async (req, res) => {
  const { userId, inputText, genre, preferences } = req.body;

  try {
    // Store user input in the database
    const userInput = new UserInput({
      userId,
      inputText,
      genre,
      preferences,
    });
    await userInput.save();

    // Process the input for AI prompt generation
    const processedInput = {
      text: inputText,
      genre,
      preferences,
    };

    // Here, we could include additional logic for pre-processing based on genre or preferences
    res.status(200).json({
      message: 'User input saved and processed successfully.',
      processedInput,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user input', error });
  }
};
