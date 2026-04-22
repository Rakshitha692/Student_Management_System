/**
 * Custom hook for managing student data
 * 
 * This hook encapsulates all student-related state and logic.
 * Makes components cleaner and logic reusable.
 * 
 * WHY: Separation of concerns - components render UI,
 * hooks manage logic
 */

import { useState, useEffect } from 'react';
import * as studentService from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate data loading on component mount
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await studentService.fetchStudents();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleAddStudent = async (studentData) => {
    try {
      const newStudent = await studentService.addStudent(studentData);
      setStudents([...students, newStudent]);
      return newStudent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUpdateStudent = async (id, studentData) => {
    try {
      const updated = await studentService.updateStudent(id, studentData);
      setStudents(students.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await studentService.deleteStudent(id);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      return loadStudents();
    }
    try {
      setLoading(true);
      const results = await studentService.searchStudents(query);
      setStudents(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.fetchStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    loading,
    error,
    handleAddStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    handleSearch,
    loadStudents
  };
};
