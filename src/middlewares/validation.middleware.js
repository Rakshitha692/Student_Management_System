const ApiError = require('../utils/apiError');

const validateStudent = (req, res, next) => {
  const { name, age, course } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new ApiError(400, 'Name is required and must be at least 2 characters'));
  }
  if (!age || typeof age !== 'number' || age < 16 || age > 100) {
    return next(new ApiError(400, 'Age is required and must be between 16 and 100'));
  }
  if (!course || typeof course !== 'string' || course.trim().length < 2) {
    return next(new ApiError(400, 'Course is required and must be at least 2 characters'));
  }

  next();
};

module.exports = validateStudent;
