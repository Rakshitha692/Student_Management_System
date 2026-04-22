/**
 * Dashboard Page
 * 
 * Main page showing list of students with CRUD operations.
 * Now connected to real backend API!
 * 
 * Uses:
 *  - useStudents hook for state management
 *  - Real API calls via studentService
 *  - MongoDB _id instead of mock id
 */

import React, { useState } from 'react';
import { StudentCard } from '../components/StudentCard';
import { StudentTable } from '../components/StudentTable';
import { StudentForm } from '../components/StudentForm';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { useStudents } from '../hooks/useStudents';

/**
 * VIEW_MODE: Determines how students are displayed
 * - 'card': Individual cards in a grid
 * - 'table': Table format
 */
const VIEW_MODE = {
  CARD: 'card',
  TABLE: 'table'
};

export const DashboardPage = () => {
  // Custom hook for student management
  const {
    students,
    loading,
    error,
    clearError,
    handleAddStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    handleSearch,
    loadStudents
  } = useStudents();

  // Page-level state
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODE.CARD);
  const [formLoading, setFormLoading] = useState(false);

  /**
   * Handle adding a new student
   * Calls API through service layer
   */
  const handleAddClick = async (formData) => {
    setFormLoading(true);
    try {
      console.log('Submitting student data:', formData);
      const result = await handleAddStudent(formData);
      console.log('Student added successfully:', result);
      
      // Add a small delay to ensure state updates properly
      setTimeout(() => {
        setShowForm(false);
        setEditingStudent(null);
      }, 100);
    } catch (err) {
      // Error is already set in hook, just keep form open
      console.error('Add failed:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      });
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle editing a student
   * Load existing data into form
   */
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  /**
   * Handle updating student
   * Sends PUT request to backend
   */
  const handleUpdateClick = async (formData) => {
    setFormLoading(true);
    try {
      // MongoDB uses _id, not id
      await handleUpdateStudent(editingStudent._id, formData);
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle deleting student
   * Removes from backend and UI
   */
  const handleDeleteClick = async (id) => {
    setFormLoading(true);
    try {
      await handleDeleteStudent(id);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle cancel form
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  // If showing form, display it
  if (showForm) {
    try {
      return (
        <main className="container mx-auto px-4 py-12">
          {error && (
            <ErrorAlert message={error} onClose={clearError} />
          )}
          <StudentForm
            editingStudent={editingStudent}
            onSubmit={editingStudent ? handleUpdateClick : handleAddClick}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        </main>
      );
    } catch (renderError) {
      console.error('Form rendering error:', renderError);
      return (
        <main className="container mx-auto px-4 py-12">
          <ErrorAlert 
            message="Form rendering error. Please refresh the page." 
            onClose={clearError} 
          />
        </main>
      );
    }
  }

  // Main dashboard view
  try {
    console.log('Rendering dashboard - showForm:', showForm, 'students:', students, 'loading:', loading);
    
    // Ensure we have valid data to render
    const safeStudents = Array.isArray(students) ? students : [];
    const isLoading = loading === true;
    const hasError = error && error.length > 0;
    
    return (
      <main className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              {isLoading ? 'Loading...' : `Manage all student records (${safeStudents.length} total)`}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingStudent(null);
              setShowForm(true);
            }}
            disabled={isLoading}
            className="text-lg px-6 py-3"
          >
            + Add Student
          </Button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Error Alert */}
        {hasError && (
          <ErrorAlert message={error} onClose={clearError} />
        )}
      </section>

      {/* View Mode Toggle */}
      {safeStudents.length > 0 && (
        <div className="mb-6 flex gap-2">
          <Button
            variant={viewMode === VIEW_MODE.CARD ? 'primary' : 'secondary'}
            onClick={() => setViewMode(VIEW_MODE.CARD)}
            className="text-sm"
            disabled={isLoading}
          >
            📇 Card View
          </Button>
          <Button
            variant={viewMode === VIEW_MODE.TABLE ? 'primary' : 'secondary'}
            onClick={() => setViewMode(VIEW_MODE.TABLE)}
            className="text-sm"
            disabled={isLoading}
          >
            📊 Table View
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <LoadingSpinner />
      ) : safeStudents.length === 0 ? (
        <EmptyState
          onAddClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
        />
      ) : viewMode === VIEW_MODE.CARD ? (
        // Card Grid View
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeStudents.map((student, index) => {
            console.log(`Rendering student ${index}:`, student);
            if (!student._id) {
              console.error('Student missing _id:', student);
            }
            return (
              <StudentCard
                key={student._id || `temp-${index}`}
                student={student}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            );
          })}
        </div>
      ) : (
        // Table View
        <StudentTable
          students={safeStudents}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Refresh Button */}
      {safeStudents.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="secondary"
            onClick={loadStudents}
            className="text-sm"
            disabled={isLoading}
          >
            🔄 Refresh Data
          </Button>
        </div>
      )}
    </main>
    );
  } catch (renderError) {
    console.error('Dashboard rendering error:', renderError);
    return (
      <main className="container mx-auto px-4 py-12">
        <ErrorAlert 
          message="Dashboard rendering error. Please refresh the page." 
          onClose={clearError} 
        />
      </main>
    );
  }
};
