/**
 * EmptyState Component
 * 
 * Shows when there are no students to display.
 * Better UX than blank screen.
 */

import React from 'react';
import { Button } from './Button';

export const EmptyState = ({ onAddClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Students Yet</h3>
      <p className="text-gray-600 mb-6">
        Get started by adding your first student to the system.
      </p>
      <Button variant="primary" onClick={onAddClick}>
        Add First Student
      </Button>
    </div>
  );
};
