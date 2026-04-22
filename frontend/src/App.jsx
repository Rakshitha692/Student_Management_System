/**
 * Main App Component
 *
 * Routes between pages based on current page state.
 * Now includes AUTHENTICATION:
 *   - Login / Signup pages
 *   - Protected routes (dashboard requires login)
 *   - Auto-logout when token expires
 *   - Auth state stored in React state
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import {
  isAuthenticated,
  isTokenExpired,
  logout,
  fetchMe,
} from './services/authService';

export const App = () => {
  const [currentPage, setCurrentPage] = useState('/');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  /**
   * Check if user is already logged in on app load.
   * If token is valid, fetch their profile.
   */
  const checkAuth = useCallback(async () => {
    if (isAuthenticated() && !isTokenExpired()) {
      try {
        const result = await fetchMe();
        setUser(result.user);
      } catch {
        // Token invalid or expired - clear it
        logout();
        setUser(null);
      }
    } else if (isTokenExpired()) {
      logout();
      setUser(null);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Periodic token expiry check (every 60 seconds).
   * Automatically logs the user out when the token expires.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && isTokenExpired()) {
        logout();
        setUser(null);
        setCurrentPage('/login');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigation = (event) => {
      setCurrentPage(event.detail.page);
    };
    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, []);

  /**
   * Called after successful login or signup.
   * Updates user state and redirects to dashboard.
   */
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('/dashboard');
  };

  /**
   * Log out the current user and redirect to login page.
   */
  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage('/login');
  };

  /**
   * Route guard helper.
   * If a page requires auth and user is not logged in, show login page.
   */
  const requireAuth = (component) => {
    if (!authChecked) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    return user ? component : <LoginPage onLoginSuccess={handleLoginSuccess} />;
  };

  /**
   * Render the correct page based on current route.
   */
  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <LandingPage />;
      case '/login':
        return user ? <DashboardPage /> : <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case '/signup':
        return user ? <DashboardPage /> : <SignupPage onLoginSuccess={handleLoginSuccess} />;
      case '/dashboard':
        return requireAuth(<DashboardPage />);
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Page Content */}
      {renderPage()}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; 2024 Student Management System. Built with React + Tailwind CSS.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Secure JWT Authentication Enabled
          </p>
        </div>
      </footer>
    </div>
  );
};
