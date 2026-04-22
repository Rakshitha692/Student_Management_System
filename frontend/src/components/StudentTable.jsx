/**
 * StudentTable Component
 * 
 * Table view for displaying students (alternative to card view).
 * Better for desktop, can show more info at once.
 * 
 * WHY: Different component for different layout needs.
 * Mobile might prefer cards, desktop might prefer table.
 * 
 * Uses semantic HTML: <table>, <thead>, <tbody>
 */

import React from 'react';
import { Button } from './Button';

export const StudentTable = ({ students, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No students found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Age</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Course</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={student.id}
              className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
            >
              <td className="px-6 py-4 text-sm text-gray-800 font-medium">{student.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{student.age}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{student.course}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="primary"
                    onClick={() => onEdit(student)}
                    className="text-xs px-3 py-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (window.confirm(`Delete ${student.name}?`)) {
                        onDelete(student.id);
                      }
                    }}
                    className="text-xs px-3 py-1"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
