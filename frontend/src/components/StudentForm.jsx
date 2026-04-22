/**
 * StudentForm Component
 * 
 * Form for adding/editing students with validation.
 * 
 * WHY: Reusable form component. Handles both create and update modes.
 * Props determine behavior (editingStudent prop).
 * 
 * React Concepts Used:
 *  - useState: manage form state
 *  - useEffect: populate form when editing
 *  - Closures: event handlers close over setState and other functions
 * 
 * Uses semantic HTML: <form>, <label>, <input>, <textarea>
 */

import React, { useState, useEffect } from 'react';
import { validateStudent } from '../utils/validation';
import { Button } from './Button';
import { uploadImage } from '../services/uploadService';

export const StudentForm = ({ editingStudent, onSubmit, onCancel, loading }) => {
  // State: form data
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: ''
  });

  // State: validation errors
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Effect: Populate form when editing
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        age: editingStudent.age,
        course: editingStudent.course,
        profileImage: editingStudent.profileImage || ''
      });
      setImagePreview(editingStudent.profileImage || '');
    } else {
      setFormData({ name: '', age: '', course: '', profileImage: '' });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
    setSubmitted(false);
  }, [editingStudent]);

  /**
   * Handle input change
   * CLOSURE: This handler has access to setFormData via closure
   * 
   * The handler is defined in this component scope, so it can access:
   *  - formData (outer scope)
   *  - setFormData (outer scope)
   * Even when called later from JSX, it "remembers" these variables.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handle image file selection with preview
   */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Only image files are allowed' }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, image: '' }));

    // Upload immediately to Cloudinary
    try {
      setUploading(true);
      const result = await uploadImage(file);
      setFormData(prev => ({ ...prev, profileImage: result.data.url }));
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (err) {
      setErrors(prev => ({ ...prev, image: err.message || 'Image upload failed' }));
      setImagePreview('');
      setImageFile(null);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Remove image
   */
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, profileImage: '' }));
  };

  /**
   * Handle form submission
   * CLOSURE: This handler accesses formData, errors, validateStudent
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate
    const validation = validateStudent(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit - convert age to number
    try {
      const dataToSubmit = {
        ...formData,
        age: Number(formData.age) // Convert age to number for backend
      };
      await onSubmit(dataToSubmit);
      // Don't reset form here - let parent component handle navigation
      // This prevents blank state during transition
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editingStudent ? 'Edit Student' : 'Add New Student'}
      </h2>

      {/* Name Field */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter student name"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Age Field */}
      <div className="mb-6">
        <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
          Age <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter age"
          min="15"
          max="60"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.age ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age}</p>
        )}
      </div>

      {/* Course Field */}
      <div className="mb-6">
        <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">
          Course <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="e.g., Computer Science, Data Science"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.course ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.course && (
          <p className="text-red-500 text-sm mt-1">{errors.course}</p>
        )}
      </div>

      {/* Profile Image Field */}
      <div className="mb-6">
        <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
          Profile Image
        </label>
        <div className="space-y-3">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
          {uploading && (
            <p className="text-blue-600 text-sm">Uploading image...</p>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
        </Button>
      </div>

      {submitted && Object.keys(errors).length === 0 && (
        <p className="text-green-600 text-sm mt-4">✓ Form submitted successfully!</p>
      )}
    </form>
  );
};
