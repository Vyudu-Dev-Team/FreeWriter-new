import { generateStoryPrompt, generateStoryGuidance } from '../services/aiService.js';

describe('AI Service', () => {
  const testCases = [
    { genre: 'fantasy', writingStyle: 'descriptive', complexity: 'high', targetAudience: 'adult' },
    { genre: 'sci-fi', writingStyle: 'concise', complexity: 'medium', targetAudience: 'young-adult' },
    { genre: 'romance', writingStyle: 'emotional', complexity: 'low', targetAudience: 'teen' },
  ];

  describe('generateStoryPrompt', () => {
    test.each(testCases)('generates a prompt for %s genre', async (params) => {
      const prompt = await generateStoryPrompt(params);
      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(10);
    });
  });

  describe('generateStoryGuidance', () => {
    test('generates story guidance based on a prompt', async () => {
      const prompt = 'A young wizard discovers a hidden city in the clouds.';
      const guidance = await generateStoryGuidance({ prompt });
      
      expect(guidance).toHaveProperty('characters');
      expect(guidance).toHaveProperty('plotPoints');
      expect(guidance).toHaveProperty('setting');
      
      expect(guidance.characters).toHaveLength(3);
      expect(guidance.plotPoints).toHaveLength(3);
      expect(typeof guidance.setting).toBe('string');
    });
  });
});