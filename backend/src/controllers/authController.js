const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');
const { 
  ValidationError, 
  AuthenticationError, 
  NotFoundError, 
  AuthorizationError,
  ConflictError
} = require('../utils/errorClass');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE
  });
};

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ConflictError('User already exists with this email or username.');
  }

  // Create user - explicitly set role to user
  const user = await User.create({
    username,
    email,
    password,
    role: 'user'
  });

  const token = generateToken(user._id);

  return successResponse(res, 201, 'User registered successfully', {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Check if banned
  if (user.isBanned) {
    throw new AuthorizationError('Your account has been banned. Access denied.');
  }

  const token = generateToken(user._id);

  return successResponse(res, 200, 'Login successful', {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
exports.logout = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'Logout successful. Token invalidated client-side.');
});

/**
 * @desc    Refresh JWT token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newToken = generateToken(user._id);
    return successResponse(res, 200, 'Token refreshed successfully', { token: newToken });
  } catch (_err) {
    throw new AuthenticationError('Invalid or expired token. Please login again.');
  }
});

/**
 * @desc    Fetch current user profile
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return successResponse(res, 200, 'Profile retrieved successfully', user);
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/v1/auth/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (username) {
    user.username = username;
  }
  if (email) {
    user.email = email;
  }
  if (password) {
    user.password = password;
  }

  await user.save();

  return successResponse(res, 200, 'Profile updated successfully', {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

/**
 * @desc    Delete user profile (account)
 * @route   DELETE /api/v1/auth/profile
 * @access  Private
 */
exports.deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return successResponse(res, 200, 'Account deleted successfully');
});

/**
 * @desc    Forgot password request
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No account found with this email.');
  }

  // Mock reset token flow
  const resetToken = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '15m' });
  return successResponse(res, 200, 'Password reset email sent (Mocked)', { resetToken });
});

/**
 * @desc    Reset password with token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, 'Password reset successfully');
  } catch (_err) {
    throw new AuthenticationError('Invalid or expired reset token.');
  }
});

/**
 * @desc    Verify email address
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return errorResponse(res, 400, 'Please provide email and verification code');
    }

    // Mock email verification success
    return successResponse(res, 200, `Email ${email} verified successfully with code ${code}`);
  } catch (err) {
    next(err);
  }
};
