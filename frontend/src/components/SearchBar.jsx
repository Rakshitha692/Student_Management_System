/**
 * SearchBar Component
 * 
 * Search input with basic functionality.
 * Currently just triggers search, actual filtering in parent.
 * 
 * WHY: Encapsulated search logic. Can add features (debouncing, etc.)
 * without affecting parent component.
 */

import React, { useState } from 'react';
import { Button } from './Button';

export const SearchBar = ({ onSearch, placeholder = "Search students..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
        {query && (
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Tip: Search by student name or course name
      </p>
    </form>
  );
};
