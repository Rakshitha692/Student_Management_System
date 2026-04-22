/**
 * Upload Service
 *
 * Handles image uploads to Cloudinary.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { authHeaders } from './authService';

/**
 * Upload a single image
 * POST /api/upload/image
 * 
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
    method: 'POST',
    headers: authHeaders(), // Note: Don't set Content-Type for FormData, browser sets it with boundary
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || data.error || 'Upload failed');
  }

  return response.json();
};
