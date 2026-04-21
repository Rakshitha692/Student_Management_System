const express = require('express');
const router = express.Router();

const controller = require('../controllers/student.controller');
const validate = require('../middlewares/validation.middleware');

router.post('/', validate, controller.createStudent);
router.get('/', controller.getAllStudents);
router.get('/:id', controller.getStudent);
router.put('/:id', validate, controller.updateStudent);
router.delete('/:id', controller.deleteStudent);

module.exports = router;