const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [16, 'Age must be at least 16'],
    max: [100, 'Age cannot exceed 100'],
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    minlength: [2, 'Course must be at least 2 characters'],
    maxlength: [100, 'Course cannot exceed 100 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search efficiency
studentSchema.index({ name: 'text' });

module.exports = mongoose.model('Student', studentSchema);
