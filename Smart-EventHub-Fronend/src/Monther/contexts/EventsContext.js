import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { mapBackendToFrontend, mapFrontendToBackend } from '../utils/dataMapper';

const EventsContext = createContext();

const eventsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
        loading: false,
        initialized: true
      };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
        loading: false
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event => 
          event.id === action.payload.id ? action.payload : event
        ),
        loading: false
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  events: [],
  loading: false,
  error: null,
  initialized: false
};

export const EventsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  // Load events from API on mount
  useEffect(() => {
    const loadEvents = async () => {
      if (state.initialized) return;
      
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const response = await eventService.getAllEvents();
        
        if (response.success) {
          // Map backend events to frontend format
          const mappedEvents = response.data.map(event => mapBackendToFrontend(event));
          dispatch({ type: 'SET_EVENTS', payload: mappedEvents });
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.message });
        }
      } catch (error) {
        console.error('Error loading events:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load events' });
      }
    };

    loadEvents();
  }, [state.initialized]);

  const addEvent = async (eventData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Map frontend data to backend format
      const backendData = mapFrontendToBackend(eventData);
      const response = await eventService.createEvent(backendData);
      
      if (response.success) {
        // Map response back to frontend format and add to state
        const frontendEvent = mapBackendToFrontend(response.data);
        dispatch({ type: 'ADD_EVENT', payload: frontendEvent });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to create event';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const updateEvent = async (eventData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Map frontend data to backend format
      const backendData = mapFrontendToBackend(eventData);
      const response = await eventService.updateEvent(eventData.id, backendData);
      
      if (response.success) {
        // Map response back to frontend format and update state
        const frontendEvent = mapBackendToFrontend(response.data);
        dispatch({ type: 'UPDATE_EVENT', payload: frontendEvent });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to update event';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const deleteEvent = async (eventId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await eventService.deleteEvent(eventId);
      
      if (response.success) {
        dispatch({ type: 'DELETE_EVENT', payload: eventId });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to delete event';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const getEventById = (eventId) => {
    return state.events.find(event => event.id === eventId);
  };

  const getEventsByCategory = (category) => {
    return state.events.filter(event => 
      category === 'all' || event.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getEventsByStatus = (status) => {
    return state.events.filter(event => event.status === status);
  };

  const searchEvents = async (query) => {
    if (!query.trim()) {
      return state.events;
    }
    
    try {
      const response = await eventService.searchEvents(query);
      
      if (response.success) {
        // Map backend events to frontend format
        return response.data.map(event => mapBackendToFrontend(event));
      } else {
        console.error('Search failed:', response.message);
        // Fallback to local search
        const lowercaseQuery = query.toLowerCase();
        return state.events.filter(event => 
          event.title.toLowerCase().includes(lowercaseQuery) ||
          event.description.toLowerCase().includes(lowercaseQuery) ||
          event.location.toLowerCase().includes(lowercaseQuery)
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      const lowercaseQuery = query.toLowerCase();
      return state.events.filter(event => 
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.description.toLowerCase().includes(lowercaseQuery) ||
        event.location.toLowerCase().includes(lowercaseQuery)
      );
    }
  };

  const value = {
    events: state.events,
    loading: state.loading,
    error: state.error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByCategory,
    getEventsByStatus,
    searchEvents
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};