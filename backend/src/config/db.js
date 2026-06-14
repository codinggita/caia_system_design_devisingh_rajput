const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    console.log('🔗 Attempting to connect to MongoDB at:', env.MONGODB_URL);
    await mongoose.connect(env.MONGODB_URL);
    
    console.log('✅ MongoDB connected successfully');
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    return mongoose.connection;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
