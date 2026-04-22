const ApiError = require('../utils/apiError');

const validateStudent = (req, res, next) => {
  let { name, age, course } = req.body;

  // Convert age to number if it's a string
  if (typeof age === 'string') {
    age = Number(age);
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new ApiError(400, 'Name is required and must be at least 2 characters'));
  }
  if (!age || typeof age !== 'number' || age < 16 || age > 100) {
    return next(new ApiError(400, 'Age is required and must be between 16 and 100'));
  }
  if (!course || typeof course !== 'string' || course.trim().length < 2) {
    return next(new ApiError(400, 'Course is required and must be at least 2 characters'));
  }

  // Update req.body with converted age
  req.body.age = age;

  next();
};

module.exports = validateStudent;
