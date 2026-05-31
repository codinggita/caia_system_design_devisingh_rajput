const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { AuthenticationError, AuthorizationError } = require('../utils/errorClass');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return next(new AuthenticationError('Authorization token missing or malformed'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AuthenticationError('User not found for provided token'));
    }

    if (user.isBanned) {
      return next(new AuthorizationError('Your account is banned'));
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AuthorizationError('You are not allowed to access this resource'));
    }
    return next();
  };
};

module.exports = {
  protect,
  authorize
};
