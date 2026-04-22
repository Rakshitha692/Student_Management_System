/**
 * Navbar Component
 *
 * Header navigation bar with logo and navigation links.
 * Updated with AUTHENTICATION:
 *   - Shows Login / Signup when not logged in
 *   - Shows user name + Logout when logged in
 */

import React from 'react';
import { Link } from './Link';

export const Navbar = ({ user, onLogout }) => {
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
        <ul className="flex items-center space-x-6">
          <li>
            <Link
              to="/"
              className="hover:text-blue-100 transition duration-200"
            >
              Home
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/dashboard"
                className="hover:text-blue-100 transition duration-200"
              >
                Dashboard
              </Link>
            </li>
          )}

          {user ? (
            <li className="flex items-center space-x-4">
              <span className="text-blue-100 text-sm">
                👋 {user.name}
              </span>
              <button
                onClick={onLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition duration-200"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-100 transition duration-200"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-sm transition duration-200"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
