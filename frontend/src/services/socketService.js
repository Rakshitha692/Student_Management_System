/**
 * Socket.IO Client Service
 *
 * Manages WebSocket connection and event listeners for real-time updates.
 *
 * EVENTS:
 * - student:created → New student added
 * - student:updated → Student modified
 * - student:deleted → Student removed
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

let socket = null;
const listeners = {};

/**
 * Initialize WebSocket connection
 */
export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('🔌 Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from WebSocket server');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
};

/**
 * Get the socket instance (creates if doesn't exist)
 */
export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

/**
 * Disconnect from WebSocket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Subscribe to a student event
 * @param {string} event - Event name (student:created, student:updated, student:deleted)
 * @param {Function} callback - Handler function
 */
export const onStudentEvent = (event, callback) => {
  const sock = getSocket();
  sock.on(event, callback);
  
  // Track listener for cleanup
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
};

/**
 * Unsubscribe from a student event
 * @param {string} event - Event name
 * @param {Function} callback - Handler function to remove
 */
export const offStudentEvent = (event, callback) => {
  const sock = getSocket();
  sock.off(event, callback);
  
  // Remove from tracking
  if (listeners[event]) {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  }
};

/**
 * Remove all event listeners
 */
export const removeAllListeners = () => {
  if (!socket) return;
  
  Object.keys(listeners).forEach(event => {
    listeners[event].forEach(callback => {
      socket.off(event, callback);
    });
  });
  
  Object.keys(listeners).forEach(key => delete listeners[key]);
};
