const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

/**
 * Auth Middleware
 *
 * Verifies the JWT token sent in the Authorization header.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 *
 * If valid:
 *   - Decodes the payload (userId, email, role)
 *   - Attaches it to req.user
 *   - Calls next() so the protected route can execute
 *
 * If invalid / missing / expired:
 *   - Returns 401 Unauthorized with a clear message
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        new ApiError(401, 'Access denied. No token provided. Please log in.')
      );
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(
        new ApiError(401, 'Access denied. Token is empty. Please log in.')
      );
    }

    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to the request object
    //    Now controllers can access req.user.userId, req.user.email, etc.
    req.user = decoded;

    next();
  } catch (error) {
    // Common JWT errors
    if (error.name === 'TokenExpiredError') {
      return next(
        new ApiError(401, 'Session expired. Please log in again.')
      );
    }
    if (error.name === 'JsonWebTokenError') {
      return next(
        new ApiError(401, 'Invalid token. Please log in again.')
      );
    }

    return next(new ApiError(401, 'Authentication failed. Please log in.'));
  }
};

module.exports = authMiddleware;
