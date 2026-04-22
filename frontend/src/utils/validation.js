/**
 * Validation Utilities
 * 
 * Frontend validation helps provide instant user feedback.
 * Backend validation is still required for security.
 */

/**
 * Validate student form data
 * Returns object: { isValid: boolean, errors: { field: 'error message' } }
 */
export const validateStudent = (data) => {
  const errors = {};

  // Validate name
  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Name must not exceed 50 characters';
  }

  // Validate age
  if (!data.age) {
    errors.age = 'Age is required';
  } else if (isNaN(data.age) || parseInt(data.age) < 15 || parseInt(data.age) > 60) {
    errors.age = 'Age must be a number between 15 and 60';
  }

  // Validate course
  if (!data.course || !data.course.trim()) {
    errors.course = 'Course is required';
  } else if (data.course.trim().length < 2) {
    errors.course = 'Course must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
