import React, { createContext, useContext, useReducer, useEffect } from 'react';

const EventsContext = createContext();

const eventsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
        loading: false
      };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, { ...action.payload, id: Date.now().toString() }],
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
  events: [
    {
      id: '1',
      title: 'UX Conference 2025',
      description: 'Join us for the biggest UX conference of the year featuring industry leaders and innovative workshops.',
      date: '2025-11-19',
      endDate: '2025-11-25',
      time: '09:00',
      location: 'Amman City, Jordan',
      category: 'Conference',
      image: '/images/ux-conference.jpg',
      status: 'upcoming',
      attendees: 250,
      maxAttendees: 500,
      price: 150,
      speakers: [
        { id: 1, name: 'Dr. Sarah Johnson', title: 'Lead UX Designer at Google' },
        { id: 2, name: 'Ahmed Al-Rashid', title: 'Design Director at Meta' }
      ],
      createdAt: '2024-10-15',
      updatedAt: '2024-10-15'
    },
    {
      id: '2',
      title: 'React Workshop',
      description: 'Hands-on workshop covering advanced React patterns and best practices for modern web development.',
      date: '2025-12-10',
      endDate: '2025-12-10',
      time: '10:00',
      location: 'Tech Hub, Amman',
      category: 'Workshop',
      image: '/images/react-workshop.jpg',
      status: 'upcoming',
      attendees: 45,
      maxAttendees: 50,
      price: 75,
      speakers: [
        { id: 1, name: 'Omar Khalil', title: 'Senior React Developer' }
      ],
      createdAt: '2024-10-16',
      updatedAt: '2024-10-16'
    }
  ],
  loading: false,
  error: null
};

export const EventsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  useEffect(() => {
    const savedEvents = localStorage.getItem('eventHub_events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        dispatch({ type: 'SET_EVENTS', payload: parsedEvents });
      } catch (error) {
        console.error('Error loading saved events:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eventHub_events', JSON.stringify(state.events));
  }, [state.events]);

  const addEvent = (eventData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newEvent = {
        ...eventData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        attendees: 0,
        status: new Date(eventData.date) > new Date() ? 'upcoming' : 'past'
      };
      dispatch({ type: 'ADD_EVENT', payload: newEvent });
      return { success: true, message: 'Event created successfully!' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const updateEvent = (eventData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedEvent = {
        ...eventData,
        updatedAt: new Date().toISOString().split('T')[0],
        status: new Date(eventData.date) > new Date() ? 'upcoming' : 'past'
      };
      dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });
      return { success: true, message: 'Event updated successfully!' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const deleteEvent = (eventId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      dispatch({ type: 'DELETE_EVENT', payload: eventId });
      return { success: true, message: 'Event deleted successfully!' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, message: error.message };
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

  const searchEvents = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return state.events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.location.toLowerCase().includes(lowercaseQuery)
    );
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