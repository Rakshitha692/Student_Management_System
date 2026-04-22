/**
 * Auth Service Layer
 *
 * Handles all authentication API calls and token management.
 * Token is stored in localStorage under the key 'token'.
 *
 * IMPORTANT SECURITY NOTES:
 *  - localStorage is simple but XSS-vulnerable. For production,
 *    consider httpOnly cookies set by the backend.
 *  - Always send the token in the Authorization header.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TOKEN_KEY = 'token';

/**
 * Get the stored JWT token
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Save the JWT token to localStorage
 */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

/**
 * Remove the JWT token (logout)
 */
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Check if user is currently authenticated (token exists)
 * Note: this does NOT verify token validity on the server.
 */
export const isAuthenticated = () => !!getToken();

/**
 * Decode token payload WITHOUT verifying signature.
 * Useful for checking expiration client-side before making requests.
 */
export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

/**
 * Check if the stored token has expired.
 * Returns true if expired or invalid.
 */
export const isTokenExpired = () => {
  const payload = decodeToken();
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

/**
 * Helper: build headers with Authorization Bearer token
 */
export const authHeaders = (extraHeaders = {}) => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extraHeaders,
  };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || data.error || `HTTP ${response.status}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

/**
 * Register a new user
 * POST /api/auth/signup
 */
export const signup = async ({ name, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await handleResponse(response);
  if (result.token) setToken(result.token);
  return result;
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export const login = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await handleResponse(response);
  if (result.token) setToken(result.token);
  return result;
};

/**
 * Log out the current user (client-side)
 * Removes token and optionally notifies the server.
 */
export const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: authHeaders(),
    });
  } catch {
    // Ignore server errors on logout
  } finally {
    removeToken();
  }
};

/**
 * Fetch current user profile
 * GET /api/auth/me
 */
export const fetchMe = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleResponse(response);
};
