/**
 * Data mapping utilities for converting between frontend and backend data formats
 */

/**
 * Map frontend event data to backend API format
 * @param {Object} frontendEvent - Event data from frontend form
 * @returns {Object} Event data formatted for backend API
 */
export const mapFrontendToBackend = (frontendEvent) => {
  const backendEvent = {
    title: frontendEvent.title,
    description: frontendEvent.description,
    location: frontendEvent.location,
    startDate: frontendEvent.date, // Frontend 'date' maps to backend 'startDate'
    endDate: frontendEvent.endDate
  };

  // Only include non-empty values
  Object.keys(backendEvent).forEach(key => {
    if (backendEvent[key] === undefined || backendEvent[key] === null || backendEvent[key] === '') {
      delete backendEvent[key];
    }
  });

  return backendEvent;
};

/**
 * Map backend event data to frontend format
 * @param {Object} backendEvent - Event data from backend API
 * @returns {Object} Event data formatted for frontend
 */
export const mapBackendToFrontend = (backendEvent) => {
  if (!backendEvent) return null;

  const frontendEvent = {
    id: backendEvent.eventId?.toString() || backendEvent.id?.toString(),
    title: backendEvent.title || '',
    description: backendEvent.description || '',
    date: backendEvent.startDate || '',
    endDate: backendEvent.endDate || backendEvent.startDate || '',
    time: extractTimeFromDate(backendEvent.startDate) || '09:00',
    location: backendEvent.location || '',
    
    // Default values for fields not in backend
    category: 'Conference', // Default category
    image: '/images/default-event.jpg',
    maxAttendees: 100,
    price: 0,
    requireApproval: false,
    isUnlimited: false,
    
    // Status based on date
    status: getEventStatus(backendEvent.startDate),
    attendees: 0, // Default value
    
    // Speakers data
    speakers: mapSpeakersToFrontend(backendEvent.speakers || []),
    
    // Timestamps
    createdAt: backendEvent.createdAt || new Date().toISOString(),
    updatedAt: backendEvent.updatedAt || new Date().toISOString(),
    createdBy: backendEvent.createdBy
  };

  return frontendEvent;
};

/**
 * Map speakers array from backend to frontend format
 * @param {Array} backendSpeakers - Speakers data from backend
 * @returns {Array} Speakers data formatted for frontend
 */
export const mapSpeakersToFrontend = (backendSpeakers) => {
  if (!Array.isArray(backendSpeakers)) return [];
  
  return backendSpeakers.map(speaker => ({
    id: speaker.speakerId || speaker.id || Date.now(),
    name: speaker.name || '',
    title: speaker.bio || speaker.title || '', // Use bio as title if title not available
    email: speaker.email || ''
  }));
};

/**
 * Map speakers array from frontend to backend format
 * @param {Array} frontendSpeakers - Speakers data from frontend
 * @returns {Array} Speakers data formatted for backend
 */
export const mapSpeakersToBackend = (frontendSpeakers) => {
  if (!Array.isArray(frontendSpeakers)) return [];
  
  return frontendSpeakers.map(speaker => ({
    name: speaker.name,
    bio: speaker.title, // Use title as bio
    email: speaker.email || ''
  }));
};

/**
 * Extract time from date string
 * @param {string} dateString - Date string that might include time
 * @returns {string} Time in HH:MM format
 */
export const extractTimeFromDate = (dateString) => {
  if (!dateString) return '09:00';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '09:00';
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    return '09:00';
  }
};

/**
 * Determine event status based on date
 * @param {string} eventDate - Event date string
 * @returns {string} Event status ('upcoming', 'past', 'today')
 */
export const getEventStatus = (eventDate) => {
  if (!eventDate) return 'upcoming';
  
  try {
    const event = new Date(eventDate);
    const today = new Date();
    
    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    
    if (event.getTime() === today.getTime()) {
      return 'today';
    } else if (event > today) {
      return 'upcoming';
    } else {
      return 'past';
    }
  } catch (error) {
    return 'upcoming';
  }
};

/**
 * Combine date and time strings for backend
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 * @returns {string} Combined datetime string
 */
export const combineDateAndTime = (date, time) => {
  if (!date) return '';
  if (!time) return date;
  
  try {
    return `${date}T${time}:00.000Z`;
  } catch (error) {
    return date;
  }
};

/**
 * Validate frontend event data before submission
 * @param {Object} eventData - Event data to validate
 * @returns {Object} Validation result with errors
 */
export const validateEventData = (eventData) => {
  const errors = {};
  
  // Required fields
  if (!eventData.title?.trim()) {
    errors.title = 'Event title is required';
  }
  
  if (!eventData.date) {
    errors.date = 'Event date is required';
  } else {
    const eventDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      errors.date = 'Event date cannot be in the past';
    }
  }
  
  if (!eventData.time) {
    errors.time = 'Event time is required';
  }
  
  // Optional field validations
  if (eventData.maxAttendees && eventData.maxAttendees < 1) {
    errors.maxAttendees = 'Maximum attendees must be at least 1';
  }
  
  if (eventData.price && eventData.price < 0) {
    errors.price = 'Price cannot be negative';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format time for display
 * @param {string} timeString - Time string
 * @returns {string} Formatted time string
 */
export const formatDisplayTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return timeString;
  }
};