import { connectToDatabase } from '../../../utils/database';
import { verifyToken } from '../../../utils/auth';
import { ObjectId } from 'mongodb';
import natural from 'natural';

module.exports =  async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = await verifyToken(req);
    const { storyId } = req.query;

    const db = await connectToDatabase();
    const Story = db.collection('stories');

    const story = await Story.findOne({ _id: ObjectId(storyId), userId: ObjectId(userId) });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Perform analytics
    const wordCount = story.content.split(/\s+/).length;
    const wordCountHistory = story.wordCountHistory || [];
    const sessionDurations = story.sessionDurations || [];
    const mostUsedWords = getMostUsedWords(story.content);
    const sentimentAnalysis = analyzeSentiment(story.content);

    const analytics = {
      wordCount,
      wordCountHistory,
      sessionDurations,
      mostUsedWords,
      sentimentAnalysis
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

function getMostUsedWords(text) {
  const words = text.toLowerCase().match(/\b(\w+)\b/g);
  const wordCounts = {};
  words.forEach(word => {
    if (word.length > 3) { // Ignore short words
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

function analyzeSentiment(text) {
  const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const sentences = text.split(/[.!?]+/);
  let positive = 0, neutral = 0, negative = 0;

  sentences.forEach(sentence => {
    const sentiment = analyzer.getSentiment(sentence.split(' '));
    if (sentiment > 0) positive++;
    else if (sentiment < 0) negative++;
    else neutral++;
  });

  const total = sentences.length;
  return {
    overall: positive > negative ? 'Positive' : negative > positive ? 'Negative' : 'Neutral',
    positive: ((positive / total) * 100).toFixed(2),
    neutral: ((neutral / total) * 100).toFixed(2),
    negative: ((negative / total) * 100).toFixed(2)
  };
}