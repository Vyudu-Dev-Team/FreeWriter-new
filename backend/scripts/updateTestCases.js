// scripts/updateTestCases.js

import { analyzeFeedback } from '../services/aiFeedbackService.js';
import { writeFileSync } from 'fs';

const generateNewTestCases = async () => {
  const feedbackAnalysis = await analyzeFeedback();
  
  // Generate new test cases based on feedback analysis
  const newTestCases = [
    // Example of generating a new test case based on low-rated genres
    ...feedbackAnalysis.ratingsByGenre
      .filter(genre => genre.averageRating < 3.5)
      .map(genre => ({
        genre: genre.name,
        writingStyle: 'descriptive',
        complexity: 'medium',
        targetAudience: 'adult'
      })),
    // Add more logic to generate diverse test cases
  ];

  // Append new test cases to the existing test file
  const testFilePath = './tests/aiService.test.js';
  const newTestCaseString = JSON.stringify(newTestCases, null, 2);
  
  writeFileSync(testFilePath, `
// Newly generated test cases
const newTestCases = ${newTestCaseString};

// Add new test cases to existing tests
describe('AI Service with new test cases', () => {
  test.each(newTestCases)('generates a prompt for %s genre', async (params) => {
    const prompt = await generateStoryPrompt(params);
    expect(prompt).toBeTruthy();
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(10);
  });
});
  `, { flag: 'a' });

  console.log('New test cases added to aiService.test.js');
};

generateNewTestCases();