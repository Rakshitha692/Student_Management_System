/**
 * LoadingSpinner Component
 * 
 * Shows while data is being fetched/updated.
 * Improves UX by indicating loading state.
 */

import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
};
