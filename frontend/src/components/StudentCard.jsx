/**
 * StudentCard Component
 * 
 * Displays individual student info in a card format.
 * Now works with MongoDB _id field
 */

import React from 'react';
import { Button } from './Button';

export const StudentCard = ({ student, onEdit, onDelete }) => {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-200">
      {/* Student Avatar */}
      <figure className="mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <figcaption className="sr-only">{student.name}'s avatar</figcaption>
      </figure>

      {/* Student Info */}
      <div className="space-y-3 text-center">
        <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-semibold">Age:</span> {student.age} years</p>
          <p><span className="font-semibold">Course:</span> {student.course}</p>
        </div>

        <p className="text-xs text-gray-400">ID: {student._id}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2 justify-center">
        <Button
          variant="primary"
          onClick={() => onEdit(student)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm(`Delete ${student.name}?`)) {
              onDelete(student._id);
            }
          }}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </article>
  );
};
