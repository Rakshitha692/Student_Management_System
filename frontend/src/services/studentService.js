/**
 * Student Service Layer
 * 
 * This layer abstracts all API calls to the backend.
 * Uses fetch API with async/await for clean, modern code.
 * 
 * API Base URL is configured via environment variables:
 *   - .env: VITE_API_BASE_URL
 *   - import.meta.env.VITE_API_BASE_URL
 */

import { authHeaders } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Custom error class for API errors
 * Makes error handling clearer in components
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

/**
 * Helper function to handle API responses
 * Throws error if response is not ok
 * Returns parsed JSON data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.message || `HTTP Error: ${response.status}`,
      response.status,
      data
    );
  }
  
  return data;
};

/**
 * Fetch all students from backend
 * GET /api/students
 * 
 * @param {number} page - Page number for pagination
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @returns {Promise<Array>} Array of students
 * @throws {ApiError} If request fails
 */
export const fetchStudents = async (page = 1, limit = 10, search = '') => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });

    const response = await fetch(
      `${API_BASE_URL}/api/students?${queryParams}`,
      {
        method: 'GET',
        headers: authHeaders()
      }
    );

    const result = await handleResponse(response);
    return result.data || []; // API returns { success, data, pagination }
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

/**
 * Fetch single student by ID
 * GET /api/students/:id
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Student object
 * @throws {ApiError} If request fails or student not found
 */
export const fetchStudentById = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/students/${id}`,
      {
        method: 'GET',
        headers: authHeaders()
      }
    );

    const result = await handleResponse(response);
    return result.data; // API returns { success, data }
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new student
 * POST /api/students
 * 
 * @param {Object} studentData - Student data { name, age, course }
 * @returns {Promise<Object>} Created student object with ID
 * @throws {ApiError} If validation fails or request fails
 */
export const addStudent = async (studentData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/students`,
      {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(studentData)
      }
    );

    const result = await handleResponse(response);
    return result.data; // API returns { success, data, message }
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

/**
 * Update existing student
 * PUT /api/students/:id
 * 
 * @param {string} id - Student ID
 * @param {Object} studentData - Updated student data { name, age, course }
 * @returns {Promise<Object>} Updated student object
 * @throws {ApiError} If validation fails, student not found, or request fails
 */
export const updateStudent = async (id, studentData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/students/${id}`,
      {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(studentData)
      }
    );

    const result = await handleResponse(response);
    return result.data; // API returns { success, data, message }
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a student
 * DELETE /api/students/:id
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Response with success status
 * @throws {ApiError} If student not found or request fails
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/students/${id}`,
      {
        method: 'DELETE',
        headers: authHeaders()
      }
    );

    const result = await handleResponse(response);
    return result; // API returns { success, message }
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    throw error;
  }
};

/**
 * Search students by name or course
 * GET /api/students?search=query
 * 
 * @param {string} query - Search query (name or course)
 * @returns {Promise<Array>} Array of matching students
 * @throws {ApiError} If request fails
 */
export const searchStudents = async (query) => {
  try {
    if (!query.trim()) {
      return fetchStudents(); // Return all if empty query
    }

    const response = await fetch(
      `${API_BASE_URL}/api/students?search=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: authHeaders()
      }
    );

    const result = await handleResponse(response);
    return result.data || [];
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};
