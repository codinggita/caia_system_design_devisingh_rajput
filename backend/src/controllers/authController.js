const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');

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
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return errorResponse(res, 400, 'User already exists with this email or username.');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user' // allow setting admin for testing, but typically defaults to user
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
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if banned
    if (user.isBanned) {
      return errorResponse(res, 403, 'Your account has been banned. Access denied.');
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
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
exports.logout = async (req, res, next) => {
  try {
    // In stateless JWT, logout is typically handled client-side by deleting the token.
    // Here we return a simple success confirmation.
    return successResponse(res, 200, 'Logout successful. Token invalidated client-side.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Refresh JWT token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return errorResponse(res, 400, 'Please provide a token to refresh');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET, { ignoreExpiration: true });
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const newToken = generateToken(user._id);
    return successResponse(res, 200, 'Token refreshed successfully', { token: newToken });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Fetch current user profile
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return successResponse(res, 200, 'Profile retrieved successfully', user);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile
 * @route   PATCH /api/v1/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    return successResponse(res, 200, 'Profile updated successfully', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete user profile (account)
 * @route   DELETE /api/v1/auth/profile
 * @access  Private
 */
exports.deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    return successResponse(res, 200, 'Account deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Forgot password request
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, 'Please provide an email');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, 'No account found with this email.');
    }

    // Mock reset token flow
    const resetToken = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '15m' });
    return successResponse(res, 200, 'Password reset email sent (Mocked)', { resetToken });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return errorResponse(res, 400, 'Please provide token and newPassword');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, 'Password reset successfully');
  } catch (err) {
    next(err);
  }
};

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
