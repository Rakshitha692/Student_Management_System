/**
 * Button Component
 * 
 * Reusable button with different variants.
 * 
 * WHY: Centralized styling and behavior. Ensures consistency
 * across the app. Easy to modify all buttons in one place.
 * 
 * Props:
 *  - children: button text
 *  - variant: 'primary' | 'secondary' | 'danger'
 *  - onClick: handler function
 *  - type: 'button' | 'submit'
 *  - disabled: boolean
 */

import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'px-4 py-2 rounded font-semibold transition duration-200 ease-in-out';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400 disabled:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
