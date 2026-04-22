/**
 * Navbar Component
 * 
 * Header navigation bar with logo and navigation links.
 * 
 * WHY: Shared across all pages. Centralized place for navigation.
 * Uses semantic HTML: <header>, <nav>
 */

import React from 'react';
import { Link } from './Link';

export const Navbar = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">📚</span>
          <Link to="/" className="text-2xl font-bold hover:text-blue-100">
            Student Manager
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="hover:text-blue-100 transition duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="hover:text-blue-100 transition duration-200"
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
