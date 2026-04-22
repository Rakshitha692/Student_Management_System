/**
 * ErrorAlert Component
 * 
 * Shows error messages to user.
 */

import React from 'react';

export const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
