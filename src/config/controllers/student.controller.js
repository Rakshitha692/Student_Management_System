const studentService = require('../services/student.services');

// CREATE
exports.createStudent = (req, res, next) => {
  try {
    const student = studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

// GET ALL
exports.getAllStudents = (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const result = studentService.getAllStudents({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// GET BY ID
exports.getStudent = (req, res, next) => {
  try {
    const student = studentService.getStudentById(req.params.id);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateStudent = (req, res, next) => {
  try {
    const updated = studentService.updateStudent(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteStudent = (req, res, next) => {
  try {
    const deleted = studentService.deleteStudent(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};