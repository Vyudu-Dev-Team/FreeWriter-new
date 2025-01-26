const winston = require( 'winston');
const path = require( 'path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Define log level based on the environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define the format of the logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports the logger must use
const transports = [
  // Console transport is always included by default
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
];

// Only add file transports if LOG_TO_FILE is set to 'true'
if (process.env.LOG_TO_FILE === 'true') {
  try {
    transports.push(
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
      }),
      new winston.transports.File({ 
        filename: path.join('logs', 'combined.log') 
      })
    );
    console.log('File logging enabled');
  } catch (error) {
    console.warn('Failed to setup file logging:', error.message);
  }
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports =  logger;