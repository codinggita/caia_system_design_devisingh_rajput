require('dotenv').config();

/**
 * Environment Configuration
 * Validates and exports all required environment variables
 * Throws error if critical variables are missing
 */

// Critical variables that must be present
const REQUIRED_VARS = ['JWT_SECRET'];

// Check for required variables
REQUIRED_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`⚠️  Warning: ${varName} is not defined in .env file`);
  }
});

const parseRateLimitWindow = () => {
  const rawValue = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10);

  if (Number.isNaN(rawValue)) {
    return 15 * 60 * 1000;
  }

  // Backward compatible: treat small values as minutes.
  if (rawValue < 1000) {
    return rawValue * 60 * 1000;
  }

  return rawValue;
};

module.exports = {
  // Server Configuration
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caia_db',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'caia_jwt_secret_key_2026_xyz_change_this_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',

  // Token Expiration
  PASSWORD_RESET_EXPIRE: parseInt(process.env.PASSWORD_RESET_EXPIRE, 10) || 30, // minutes
  EMAIL_VERIFY_EXPIRE: parseInt(process.env.EMAIL_VERIFY_EXPIRE, 10) || 60, // minutes

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseRateLimitWindow(),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 1000,

  // Logging & Monitoring
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  ENABLE_REQUEST_LOGGING: process.env.ENABLE_REQUEST_LOGGING !== 'false',
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false',

  // API Documentation
  ENABLE_SWAGGER: process.env.ENABLE_SWAGGER !== 'false',
  SWAGGER_VERSION: process.env.SWAGGER_VERSION || '1.0.0'
};
