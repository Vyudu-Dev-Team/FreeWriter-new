// services/aiFeedbackService.js
const Feedback = require( '../models/Feedback.js');
const { updateAIModel } = require( '../services/aiService.js');

const analyzeFeedback = async () => {
  const feedbacks = await Feedback.find().populate('user', 'writingStyle').populate('prompt', 'genre');
  
  const averageRating = calculateAverageRating(feedbacks);
  const ratingsByGenre = calculateRatingsByGenre(feedbacks);
  const ratingsByWritingStyle = calculateRatingsByWritingStyle(feedbacks);
  
  return {
    averageRating,
    ratingsByGenre,
    ratingsByWritingStyle
  };
};

const adjustAIParameters = async (analysis) => {
  const newParameters = {
    temperature: calculateNewTemperature(analysis.averageRating),
    topP: calculateNewTopP(analysis.ratingsByGenre),
    frequencyPenalty: calculateNewFrequencyPenalty(analysis.ratingsByWritingStyle),
    presencePenalty: calculateNewPresencePenalty(analysis.ratingsByGenre)
  };

  await updateAIModel(newParameters);

  return newParameters;
};

const calculateAverageRating = (feedbacks) => {
  const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
  return feedbacks.length > 0 ? sum / feedbacks.length : 0;
};

const calculateRatingsByGenre = (feedbacks) => {
  const genreRatings = {};
  feedbacks.forEach(feedback => {
    const genre = feedback.prompt.genre;
    if (!genreRatings[genre]) {
      genreRatings[genre] = { sum: 0, count: 0 };
    }
    genreRatings[genre].sum += feedback.rating;
    genreRatings[genre].count++;
  });

  return Object.entries(genreRatings).map(([genre, data]) => ({
    genre,
    averageRating: data.count > 0 ? data.sum / data.count : 0
  }));
};

const calculateRatingsByWritingStyle = (feedbacks) => {
  const styleRatings = {};
  feedbacks.forEach(feedback => {
    const style = feedback.user.writingStyle;
    if (!styleRatings[style]) {
      styleRatings[style] = { sum: 0, count: 0 };
    }
    styleRatings[style].sum += feedback.rating;
    styleRatings[style].count++;
  });

  return Object.entries(styleRatings).map(([style, data]) => ({
    style,
    averageRating: data.count > 0 ? data.sum / data.count : 0
  }));
};

const calculateNewTemperature = (averageRating) => {
  // Adjust temperature inversely to the average rating
  // Higher ratings lead to lower temperature (more focused output)
  return Math.max(0.5, Math.min(1.0, 1.5 - averageRating * 0.2));
};

const calculateNewTopP = (ratingsByGenre) => {
  // Adjust top_p based on the lowest-rated genre
  const lowestRatedGenre = ratingsByGenre.reduce((min, genre) => 
    genre.averageRating < min.averageRating ? genre : min
  );
  // Lower top_p for lower-rated genres (more focused output)
  return Math.max(0.1, Math.min(1.0, 1.1 - lowestRatedGenre.averageRating * 0.2));
};

const calculateNewFrequencyPenalty = (ratingsByWritingStyle) => {
  // Adjust frequency penalty based on writing style ratings
  const averageStyleRating = ratingsByWritingStyle.reduce((sum, style) => 
    sum + style.averageRating, 0
  ) / ratingsByWritingStyle.length;
  // Increase frequency penalty for lower average ratings (encourage more variety)
  return Math.max(0, Math.min(2.0, 2.5 - averageStyleRating * 0.5));
};

const calculateNewPresencePenalty = (ratingsByGenre) => {
  // Adjust presence penalty based on genre diversity
  const genreDiversity = ratingsByGenre.length / 10; // Assuming 10 as max number of genres
  // Higher genre diversity leads to lower presence penalty (encourage more diverse topics)
  return Math.max(0, Math.min(2.0, 2.0 - genreDiversity));
};

module.exports = {
  analyzeFeedback,
  adjustAIParameters,
};