/**
 * Dashboard Page
 * 
 * Main page showing list of students with CRUD operations.
 * 
 * React Concepts:
 *  - useState: manage page state (showForm, editingStudent, etc.)
 *  - useEffect: load students on mount (via custom hook)
 *  - Props: pass callbacks and data to child components
 * 
 * Uses semantic HTML: <main>, <section>
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
  const [localError, setLocalError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  /**
   * Handle adding a new student
   * CLOSURE: This function closes over state setters and handleAddStudent
   */
  const handleAddClick = async (formData) => {
    setFormLoading(true);
    try {
      await handleAddStudent(formData);
      setShowForm(false);
      setEditingStudent(null);
      setLocalError(null);
    } catch (err) {
      setLocalError('Failed to add student. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle editing a student
   * CLOSURE: Accesses setEditingStudent, setShowForm
   */
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setShowForm(true);
    setLocalError(null);
  };

  /**
   * Handle updating student
   * CLOSURE: Accesses state and async function
   */
  const handleUpdateClick = async (formData) => {
    setFormLoading(true);
    try {
      await handleUpdateStudent(editingStudent.id, formData);
      setShowForm(false);
      setEditingStudent(null);
      setLocalError(null);
    } catch (err) {
      setLocalError('Failed to update student. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  /**
   * Handle deleting student
   */
  const handleDeleteClick = async (id) => {
    setFormLoading(true);
    try {
      await handleDeleteStudent(id);
      setLocalError(null);
    } catch (err) {
      setLocalError('Failed to delete student. Please try again.');
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
    setLocalError(null);
  };

  // If showing form, display it
  if (showForm) {
    return (
      <main className="container mx-auto px-4 py-12">
        {localError && (
          <ErrorAlert message={localError} onClose={() => setLocalError(null)} />
        )}
        <StudentForm
          editingStudent={editingStudent}
          onSubmit={editingStudent ? handleUpdateClick : handleAddClick}
          onCancel={handleCancelForm}
          loading={formLoading}
        />
      </main>
    );
  }

  // Main dashboard view
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage all student records ({students.length} total)
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingStudent(null);
              setShowForm(true);
            }}
            className="text-lg px-6 py-3"
          >
            + Add Student
          </Button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Error Alert */}
        {localError && (
          <ErrorAlert message={localError} onClose={() => setLocalError(null)} />
        )}
        {error && (
          <ErrorAlert message={error} onClose={() => setLocalError(null)} />
        )}
      </section>

      {/* View Mode Toggle */}
      {students.length > 0 && (
        <div className="mb-6 flex gap-2">
          <Button
            variant={viewMode === VIEW_MODE.CARD ? 'primary' : 'secondary'}
            onClick={() => setViewMode(VIEW_MODE.CARD)}
            className="text-sm"
          >
            📇 Card View
          </Button>
          <Button
            variant={viewMode === VIEW_MODE.TABLE ? 'primary' : 'secondary'}
            onClick={() => setViewMode(VIEW_MODE.TABLE)}
            className="text-sm"
          >
            📊 Table View
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner />
      ) : students.length === 0 ? (
        <EmptyState
          onAddClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
        />
      ) : viewMode === VIEW_MODE.CARD ? (
        // Card Grid View
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        // Table View
        <StudentTable
          students={students}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Refresh Button */}
      {students.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="secondary"
            onClick={loadStudents}
            className="text-sm"
          >
            🔄 Refresh Data
          </Button>
        </div>
      )}
    </main>
  );
};
