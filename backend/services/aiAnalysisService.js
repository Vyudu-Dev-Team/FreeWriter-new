// services/aiAnalysisService.js

import { generateStoryPrompt, generateStoryGuidance } from './aiService.js';
import natural from 'natural';
import genreKeywords from '../data/genreKeywords.js';
import stylePatterns from '../data/stylePatterns.js';
import inappropriateWords from '../data/inappropriateWords.js';

export const analyzePromptQuality = async (params) => {
  const prompt = await generateStoryPrompt(params);
  
  return {
    prompt,
    wordCount: prompt.split(' ').length,
    genreRelevance: calculateGenreRelevance(prompt, params.genre),
    styleAdherence: calculateStyleAdherence(prompt, params.writingStyle),
    complexityMatch: calculateComplexityMatch(prompt, params.complexity),
    audienceAppropriateness: calculateAudienceAppropriateness(prompt, params.targetAudience)
  };
};

export const analyzeGuidanceQuality = async (prompt) => {
  const guidance = await generateStoryGuidance({ prompt });
  
  return {
    guidance,
    characterDepth: calculateCharacterDepth(guidance.characters),
    plotCoherence: calculatePlotCoherence(guidance.plotPoints),
    settingVividness: calculateSettingVividness(guidance.setting)
  };
};

const calculateGenreRelevance = (prompt, genre) => {
  const keywords = genreKeywords[genre] || [];
  const tokenizer = new natural.WordTokenizer();
  const promptTokens = tokenizer.tokenize(prompt.toLowerCase());
  const matchingKeywords = keywords.filter(keyword => promptTokens.includes(keyword.toLowerCase()));
  return matchingKeywords.length / keywords.length;
};

const calculateStyleAdherence = (prompt, style) => {
  const patterns = stylePatterns[style] || [];
  return patterns.reduce((score, pattern) => {
    return score + (new RegExp(pattern, 'i').test(prompt) ? 1 : 0);
  }, 0) / patterns.length;
};

const calculateComplexityMatch = (prompt, complexity) => {
  const fleschKincaid = natural.FleschKincaid;
  const score = fleschKincaid.getGrade(prompt);
  const complexityScores = { low: 6, medium: 10, high: 14 };
  const targetScore = complexityScores[complexity];
  return 1 - Math.min(Math.abs(score - targetScore) / targetScore, 1);
};

const calculateAudienceAppropriateness = (prompt, audience) => {
  const inappropriateForAudience = inappropriateWords[audience] || [];
  const tokenizer = new natural.WordTokenizer();
  const promptTokens = tokenizer.tokenize(prompt.toLowerCase());
  const inappropriateCount = inappropriateForAudience.filter(word => promptTokens.includes(word.toLowerCase())).length;
  return 1 - (inappropriateCount / promptTokens.length);
};

const calculateCharacterDepth = (characters) => {
  return characters.reduce((sum, character) => {
    const depthScore = (character.background ? 0.3 : 0) +
                       (character.motivation ? 0.3 : 0) +
                       (character.personality ? 0.4 : 0);
    return sum + depthScore;
  }, 0) / Math.max(1, characters.length);
};

const calculatePlotCoherence = (plotPoints) => {
  if (plotPoints.length < 2) return 1; // Perfect coherence for 0 or 1 plot point
  
  const coherenceScore = plotPoints.reduce((score, point, index) => {
    if (index === 0) return score;
    const prevPoint = plotPoints[index - 1];
    return score + (isCoherent(prevPoint, point) ? 1 : 0);
  }, 0);
  return coherenceScore / (plotPoints.length - 1);
};

const calculateSettingVividness = (setting) => {
  const vivdnessFactors = ['time', 'place', 'environment', 'atmosphere', 'culture'];
  return vivdnessFactors.reduce((score, factor) => {
    return score + (setting[factor] && setting[factor].length > 10 ? 1 : 0);
  }, 0) / vivdnessFactors.length;
};

const isCoherent = (prevPoint, currentPoint) => {
  // Simple coherence check: look for common words or phrases
  const commonWords = prevPoint.split(' ').filter(word => currentPoint.includes(word));
  return commonWords.length > 0;
};