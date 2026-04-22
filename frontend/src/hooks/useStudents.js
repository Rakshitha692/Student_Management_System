/**
 * Custom hook for managing student data
 * 
 * This hook encapsulates all student-related state and logic.
 * Makes components cleaner and logic reusable.
 * 
 * Handles:
 *  - Fetching students from backend
 *  - Managing loading/error states
 *  - CRUD operations (create, update, delete)
 *  - Search functionality
 */

import { useState, useEffect, useCallback } from 'react';
import * as studentService from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load students from backend
   * Called on component mount and when manually refreshing
   */
  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.fetchStudents();
      setStudents(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load students';
      setError(errorMessage);
      console.error('Load students error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch students on component mount
   * Dependency: loadStudents (will only change on mount due to useCallback)
   */
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  /**
   * Add new student
   * Updates local state optimistically
   * Falls back to full reload if error occurs
   */
  const handleAddStudent = useCallback(async (studentData) => {
    try {
      const newStudent = await studentService.addStudent(studentData);
      // Optimistic update: add to local state immediately
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add student';
      setError(errorMessage);
      console.error('Add student error:', err);
      throw err;
    }
  }, []);

  /**
   * Update existing student
   * Updates local state optimistically
   */
  const handleUpdateStudent = useCallback(async (id, studentData) => {
    try {
      const updatedStudent = await studentService.updateStudent(id, studentData);
      // Optimistic update: replace in local state
      setStudents(prev =>
        prev.map(s => s._id === id ? updatedStudent : s)
      );
      return updatedStudent;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update student';
      setError(errorMessage);
      console.error('Update student error:', err);
      throw err;
    }
  }, []);

  /**
   * Delete student
   * Removes from local state optimistically
   * Reverts if error occurs
   */
  const handleDeleteStudent = useCallback(async (id) => {
    // Find student to restore if delete fails
    const studentToRestore = students.find(s => s._id === id);
    
    try {
      // Optimistic update: remove from local state immediately
      setStudents(prev => prev.filter(s => s._id !== id));
      
      await studentService.deleteStudent(id);
    } catch (err) {
      // Revert on error
      if (studentToRestore) {
        setStudents(prev => [...prev, studentToRestore]);
      }
      
      const errorMessage = err.message || 'Failed to delete student';
      setError(errorMessage);
      console.error('Delete student error:', err);
      throw err;
    }
  }, [students]);

  /**
   * Search students
   * Fetches filtered results from backend
   * Clear search with empty query
   */
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      // Clear search - reload all students
      await loadStudents();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const results = await studentService.searchStudents(query);
      setStudents(results);
    } catch (err) {
      const errorMessage = err.message || 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [loadStudents]);

  /**
   * Clear error message
   * Useful for dismissing error alerts
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    students,
    loading,
    error,
    clearError,
    handleAddStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    handleSearch,
    loadStudents
  };
};
