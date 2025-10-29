import { API_CONFIG, getAuthHeaders, clearAuth } from './apiConfig';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Generic API request wrapper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
    ...options
  };

  // Add body if provided
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle successful responses
    if (response.ok) {
      return {
        success: true,
        data: data,
        status: response.status
      };
    }

    // Handle authentication errors
    if (response.status === 401) {
      // Try to refresh token first
      const refreshResult = await refreshToken();
      if (refreshResult.success) {
        // Retry the original request with new token
        const retryConfig = {
          ...config,
          headers: getAuthHeaders()
        };
        return apiRequest(endpoint, retryConfig);
      } else {
        // Clear auth and redirect to login
        clearAuth();
        window.location.href = '/login';
        throw new ApiError('Authentication failed', 401, data);
      }
    }

    // Handle other errors
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data
    );

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError('Network error. Please check your connection.', 0);
    }
    
    // Handle timeout errors
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout. Please try again.', 0);
    }
    
    throw new ApiError('An unexpected error occurred', 0, error);
  }
};

// Refresh authentication token
const refreshToken = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      credentials: 'include', // Include httpOnly cookies
      headers: API_CONFIG.HEADERS
    });

    if (response.ok) {
      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        return { success: true, token: data.accessToken };
      }
    }
    
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// API service methods
export const apiService = {
  // GET request
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiRequest(url, { method: 'GET' });
  },

  // POST request
  post: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: data
    });
  },

  // PUT request
  put: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: data
    });
  },

  // DELETE request
  delete: (endpoint) => {
    return apiRequest(endpoint, { method: 'DELETE' });
  },

  // PATCH request
  patch: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: data
    });
  }
};

// Error handler utility
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  return 'Network error. Please check your connection and try again.';
};

export default apiService;