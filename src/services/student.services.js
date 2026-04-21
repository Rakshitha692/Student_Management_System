const Student = require('../models/student.model');
const ApiError = require('../utils/apiError');

class StudentService {
  // Create a new student
  async createStudent(data) {
    try {
      const student = await Student.create(data);
      return student;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ApiError(400, 'Validation Error: ' + Object.values(error.errors).map(e => e.message).join(', '));
      }
      throw new ApiError(500, 'Error creating student');
    }
  }

  // Get all students with pagination and search
  async getAllStudents(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      const query = search ? { name: { $regex: search, $options: 'i' } } : {};

      const students = await Student.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Student.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return {
        students,
        pagination: {
          currentPage: page,
          totalPages,
          totalStudents: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new ApiError(500, 'Error fetching students');
    }
  }

  // Get student by ID
  async getStudentById(id) {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, 'Invalid student ID');
      }
      const student = await Student.findById(id);
      if (!student) {
        throw new ApiError(404, 'Student not found');
      }
      return student;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching student');
    }
  }

  // Update student
  async updateStudent(id, data) {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, 'Invalid student ID');
      }
      const student = await Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!student) {
        throw new ApiError(404, 'Student not found');
      }
      return student;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ApiError(400, 'Validation Error: ' + Object.values(error.errors).map(e => e.message).join(', '));
      }
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating student');
    }
  }

  // Delete student
  async deleteStudent(id) {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, 'Invalid student ID');
      }
      const student = await Student.findByIdAndDelete(id);
      if (!student) {
        throw new ApiError(404, 'Student not found');
      }
      return student;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting student');
    }
  }
}

module.exports = new StudentService();
