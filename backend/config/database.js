const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports =   connectDB;
