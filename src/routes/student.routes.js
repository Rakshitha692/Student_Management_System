const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers/student.controller');
const validateStudent = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// All student routes are protected - only authenticated users can access
router.use(authMiddleware);

router.post('/', validateStudent, createStudent);
router.get('/', getAllStudents); // Supports ?page=1&limit=10&search=john
router.get('/:id', getStudentById);
router.put('/:id', validateStudent, updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
