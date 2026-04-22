/**
 * Student Service Layer
 * 
 * This layer abstracts data fetching and manipulation.
 * Currently uses mock data with simulated async behavior.
 * 
 * FUTURE: Replace fetch() calls with real API endpoints:
 *   - fetch('http://localhost:5000/api/students')
 *   - fetch('http://localhost:5000/api/students', { method: 'POST', ... })
 * 
 * WHY: This structure allows seamless backend integration without
 * changing component code. Components only call these methods.
 */

import { mockStudents } from '../data/mockData.js';

// Simulate API delay (remove when using real API)
const API_DELAY = 500;

/**
 * Simulate async behavior - useful for showing loading states
 * In production, this will be actual network latency
 */
const simulateDelay = () => 
  new Promise(resolve => setTimeout(resolve, API_DELAY));

/**
 * Fetch all students
 * Currently: Returns mock data after simulated delay
 * Future API: GET /api/students
 */
export const fetchStudents = async () => {
  await simulateDelay();
  // TODO: Replace with real API call:
  // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students`);
  // return await response.json();
  return [...mockStudents];
};

/**
 * Fetch student by ID
 * Currently: Filters mock data
 * Future API: GET /api/students/:id
 */
export const fetchStudentById = async (id) => {
  await simulateDelay();
  // TODO: Replace with: fetch(`${process.env.REACT_APP_API_URL}/api/students/${id}`)
  return mockStudents.find(student => student.id === id);
};

/**
 * Add new student
 * Currently: Adds to mock data array
 * Future API: POST /api/students
 */
export const addStudent = async (studentData) => {
  await simulateDelay();
  // TODO: Replace with:
  // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(studentData)
  // });
  // return await response.json();
  
  const newStudent = {
    id: Date.now().toString(),
    ...studentData
  };
  mockStudents.push(newStudent);
  return newStudent;
};

/**
 * Update student
 * Currently: Updates mock data
 * Future API: PUT /api/students/:id
 */
export const updateStudent = async (id, studentData) => {
  await simulateDelay();
  // TODO: Replace with:
  // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(studentData)
  // });
  // return await response.json();
  
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents[index] = { id, ...studentData };
    return mockStudents[index];
  }
  throw new Error('Student not found');
};

/**
 * Delete student
 * Currently: Removes from mock data
 * Future API: DELETE /api/students/:id
 */
export const deleteStudent = async (id) => {
  await simulateDelay();
  // TODO: Replace with:
  // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${id}`, {
  //   method: 'DELETE'
  // });
  // return await response.json();
  
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents.splice(index, 1);
    return { success: true };
  }
  throw new Error('Student not found');
};

/**
 * Search students by name or course
 * Currently: Filters mock data
 * Future API: GET /api/students/search?q=query
 */
export const searchStudents = async (query) => {
  await simulateDelay();
  // TODO: Replace with: fetch(`${process.env.REACT_APP_API_URL}/api/students/search?q=${query}`)
  
  const lowerQuery = query.toLowerCase();
  return mockStudents.filter(student =>
    student.name.toLowerCase().includes(lowerQuery) ||
    student.course.toLowerCase().includes(lowerQuery)
  );
};
