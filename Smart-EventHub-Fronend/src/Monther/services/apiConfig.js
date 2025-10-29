// API Configuration for Smart EventHub Admin
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      REFRESH: '/auth/refresh-token'
    },
    // Event endpoints
    EVENTS: {
      BASE: '/events',
      BY_ID: (id) => `/events/${id}`,
      SEARCH: '/events/search',
      LATEST: '/events/latest',
      POPULAR: '/events/popular',
      BY_SPEAKER: (speakerId) => `/events/speaker/${speakerId}`
    }
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Get authentication token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Set authentication token to localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

// Get authentication headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...API_CONFIG.HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
};