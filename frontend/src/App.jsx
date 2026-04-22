/**
 * Main App Component
 * 
 * Routes between pages based on current page state.
 * 
 * NOTE: This uses a simple routing approach with custom events
 * for demonstration. In production, use React Router v6:
 *   import { BrowserRouter, Routes, Route } from 'react-router-dom'
 * 
 * Current approach:
 *  - Uses window events for navigation
 *  - Simple useState for routing
 *  - Good for learning React basics
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

export const App = () => {
  const [currentPage, setCurrentPage] = useState('/');

  // Listen for navigation events
  useEffect(() => {
    const handleNavigation = (event) => {
      setCurrentPage(event.detail.page);
    };

    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      {currentPage === '/' ? <LandingPage /> : <DashboardPage />}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>
            © 2024 Student Management System. Built with React + Tailwind CSS.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Backend integration coming soon! 🚀
          </p>
        </div>
      </footer>
    </div>
  );
};
