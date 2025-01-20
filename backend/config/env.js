const dotenv = require('dotenv');
const path = require('path');
const logger = require('../utils/logger.js');

// Load environment variables from the root .env file
const envPath = path.resolve(__dirname, '../../.env');
logger.info(`Loading environment variables from: ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  logger.error('Error loading .env file:', result.error);
  throw result.error;
}

// Validate required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'MONGODB_URI',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  const error = new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  logger.error(error.message);
  throw error;
}

// Log successful loading of environment variables
logger.info('Environment variables loaded successfully:', {
  nodeEnv: process.env.NODE_ENV,
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  openAIKeyLength: process.env.OPENAI_API_KEY?.length,
});

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  // Add other environment variables as needed
};