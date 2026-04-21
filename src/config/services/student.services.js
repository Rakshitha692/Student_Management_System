const fs = require('fs');
const path = require('path');
const Student = require('../models/student.model');
const generateId = require('../utils/generateId');
const ApiError = require('../utils/apiError');

const filePath = path.join(__dirname, '../data/students.json');

// Read data
const readData = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Write data
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// CREATE
exports.createStudent = (data) => {
  const students = readData();

  const newStudent = new Student({
    id: generateId(),
    ...data,
  });

  students.push(newStudent);
  writeData(students);

  return newStudent;
};

// GET ALL + Pagination + Search
exports.getAllStudents = ({ page = 1, limit = 5, search = '' }) => {
  let students = readData();

  if (search) {
    students = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const start = (page - 1) * limit;
  const paginated = students.slice(start, start + limit);

  return {
    total: students.length,
    page,
    limit,
    data: paginated,
  };
};

// GET BY ID
exports.getStudentById = (id) => {
  const students = readData();
  const student = students.find(s => s.id === id);

  if (!student) throw new ApiError(404, 'Student not found');

  return student;
};

// UPDATE
exports.updateStudent = (id, updateData) => {
  const students = readData();
  const index = students.findIndex(s => s.id === id);

  if (index === -1) throw new ApiError(404, 'Student not found');

  students[index] = { ...students[index], ...updateData };
  writeData(students);

  return students[index];
};

// DELETE
exports.deleteStudent = (id) => {
  const students = readData();
  const index = students.findIndex(s => s.id === id);

  if (index === -1) throw new ApiError(404, 'Student not found');

  const deleted = students.splice(index, 1);
  writeData(students);

  return deleted[0];
};