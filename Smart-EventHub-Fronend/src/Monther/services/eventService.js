import { apiService, handleApiError } from './apiService';
import { API_CONFIG } from './apiConfig';

// Event service for admin operations
export const eventService = {
  
  // ===== AVAILABLE API ENDPOINTS =====
  
  /**
   * Get all events
   * @returns {Promise<Array>} Array of events
   */
  async getAllEvents() {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.EVENTS.BASE);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error)
      };
    }
  },

  /**
   * Get event by ID
   * @param {string|number} eventId - Event ID
   * @returns {Promise<Object>} Event data
   */
  async getEventById(eventId) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.EVENTS.BY_ID(eventId));
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: handleApiError(error)
      };
    }
  },

  /**
   * Search events by title
   * @param {string} searchQuery - Search term
   * @returns {Promise<Array>} Array of matching events
   */
  async searchEvents(searchQuery) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.EVENTS.SEARCH, {
        title: searchQuery
      });
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error)
      };
    }
  },

  /**
   * Get latest events
   * @returns {Promise<Array>} Array of latest events
   */
  async getLatestEvents() {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.EVENTS.LATEST);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error)
      };
    }
  },

  /**
   * Get popular events
   * @returns {Promise<Array>} Array of popular events
   */
  async getPopularEvents() {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.EVENTS.POPULAR);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error)
      };
    }
  },

  /**
   * Get events by speaker
   * @param {string|number} speakerId - Speaker ID
   * @returns {Promise<Array>} Array of events
   */
  async getEventsBySpeaker(speakerId) {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.EVENTS.BY_SPEAKER(speakerId));
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error)
      };
    }
  },

  // ===== MOCK FUNCTIONS (MISSING BACKEND ENDPOINTS) =====

  /**
   * Create new event (MOCK - Backend endpoint missing)
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Created event
   */
  async createEvent(eventData) {
    // TODO: Replace with real API call when POST /api/events is implemented
    console.warn('createEvent: Using mock implementation - POST /api/events endpoint missing');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful creation
      const mockEvent = {
        eventId: Date.now(),
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: localStorage.getItem('userId') || 1
      };
      
      return {
        success: true,
        data: mockEvent,
        message: 'Event created successfully (mock)'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create event'
      };
    }
  },

  /**
   * Update existing event (MOCK - Backend endpoint missing)
   * @param {string|number} eventId - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Updated event
   */
  async updateEvent(eventId, eventData) {
    // TODO: Replace with real API call when PUT /api/events/:id is implemented
    console.warn('updateEvent: Using mock implementation - PUT /api/events/:id endpoint missing');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful update
      const mockEvent = {
        eventId: eventId,
        ...eventData,
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: mockEvent,
        message: 'Event updated successfully (mock)'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update event'
      };
    }
  },

  /**
   * Delete event (MOCK - Backend endpoint missing)
   * @param {string|number} eventId - Event ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteEvent(eventId) {
    // TODO: Replace with real API call when DELETE /api/events/:id is implemented
    console.warn('deleteEvent: Using mock implementation - DELETE /api/events/:id endpoint missing');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: { eventId },
        message: 'Event deleted successfully (mock)'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete event'
      };
    }
  }
};

export default eventService;