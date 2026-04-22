const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

/**
 * Generate a signed JWT token
 *
 * Payload: { userId, email, role }
 * Secret:   process.env.JWT_SECRET
 * Expiry:   7 days (configurable)
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Please provide name, email and password'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'Email already registered'));
    }

    // Create user (password is auto-hashed by the pre-save middleware in User model)
    const user = await User.create({ name, email, password });

    // Generate token immediately so user is logged in after signup
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    // Find user and explicitly select password (it's hidden by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    // Compare password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user info
 * @access  Private (requires JWT)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the auth middleware
    const user = await User.findById(req.user.userId);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side: just delete token)
 * @access  Public
 */
const logout = async (req, res, next) => {
  try {
    // Since JWT is stateless, the server can't "invalidate" the token.
    // The client must remove it from localStorage.
    // We return a success message as a hint to the frontend.
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove token from storage.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
};
