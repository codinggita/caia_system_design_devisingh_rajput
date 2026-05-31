const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  await mongoose.connect(env.MONGODB_URI);
  return mongoose.connection;
};

module.exports = connectDB;
