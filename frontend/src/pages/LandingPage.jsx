/**
 * Landing Page
 * 
 * Hero section with app introduction and features.
 * First page users see.
 * 
 * Uses semantic HTML: <section>, <article>
 */

import React from 'react';
import { Button } from '../components/Button';
import { Link } from '../components/Link';
import { isAuthenticated } from '../services/authService';

export const LandingPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 mb-16">
          <div className="text-6xl">📚</div>
          <h1 className="text-5xl font-bold text-gray-900">
            Student Management System
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            A modern, intuitive platform to manage student information with ease.
            Create, read, update, and delete student records effortlessly.
          </p>
          <div>
            {isAuthenticated() ? (
              <Link to="/dashboard">
                <Button variant="primary" className="text-lg px-8 py-3">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button variant="primary" className="text-lg px-8 py-3">
                  Get Started →
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Key Features
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1: Create */}
            <article className="text-center space-y-4">
              <div className="text-5xl">➕</div>
              <h3 className="text-xl font-bold text-gray-800">Add Students</h3>
              <p className="text-gray-600">
                Quickly add new students with essential information like name, age, and course.
              </p>
            </article>

            {/* Feature 2: Read */}
            <article className="text-center space-y-4">
              <div className="text-5xl">👀</div>
              <h3 className="text-xl font-bold text-gray-800">View Records</h3>
              <p className="text-gray-600">
                Browse all student records in a clean, organized dashboard with card or table view.
              </p>
            </article>

            {/* Feature 3: Update */}
            <article className="text-center space-y-4">
              <div className="text-5xl">✏️</div>
              <h3 className="text-xl font-bold text-gray-800">Edit Students</h3>
              <p className="text-gray-600">
                Modify student information anytime with our intuitive edit form.
              </p>
            </article>

            {/* Feature 4: Delete */}
            <article className="text-center space-y-4">
              <div className="text-5xl">🗑️</div>
              <h3 className="text-xl font-bold text-gray-800">Delete Records</h3>
              <p className="text-gray-600">
                Remove student records safely with confirmation to prevent accidental deletion.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Built With Modern Tech
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl">⚛️</div>
              <h3 className="text-xl font-bold text-gray-800">React 18</h3>
              <p className="text-gray-600">
                Modern UI library with hooks for state management
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-4xl">🎨</div>
              <h3 className="text-xl font-bold text-gray-800">Tailwind CSS</h3>
              <p className="text-gray-600">
                Utility-first CSS for responsive, beautiful designs
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-4xl">⚡</div>
              <h3 className="text-xl font-bold text-gray-800">Vite</h3>
              <p className="text-gray-600">
                Lightning-fast build tool for modern web apps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100">
            {isAuthenticated()
              ? 'Continue managing your students in the dashboard.'
              : 'Create a free account and start managing your students now.'}
          </p>
          <Link to={isAuthenticated() ? '/dashboard' : '/signup'}>
            <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
              {isAuthenticated() ? 'Open Dashboard →' : 'Sign Up Free →'}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};
