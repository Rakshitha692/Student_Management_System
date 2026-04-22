/**
 * Link Component
 * 
 * Simple navigation link that updates the active page.
 * In a real app, would use React Router, but we're keeping it simple.
 */

import React from 'react';

export const Link = ({ to, children, className = '', onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    // Simple routing: dispatch custom event that App.jsx listens to
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { page: to } })
    );
    onClick?.();
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
