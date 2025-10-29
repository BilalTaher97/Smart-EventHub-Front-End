import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    case 'SET_SELECTED_EVENT':
      return {
        ...state,
        selectedEvent: action.payload
      };
    case 'SET_MODAL_STATE':
      return {
        ...state,
        modal: { ...state.modal, ...action.payload }
      };
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notification: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  viewMode: 'grid', // 'grid' | 'list'
  filters: {
    category: 'all',
    status: 'all',
    dateRange: 'all' // 'upcoming', 'past', 'today', 'this-week', 'this-month'
  },
  searchQuery: '',
  selectedEvent: null,
  modal: {
    isOpen: false,
    type: null, // 'create', 'edit', 'view', 'delete'
    data: null
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0
  },
  notification: null, // { type: 'success' | 'error' | 'info', message: string }
  loading: false
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  const setViewMode = (mode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
    // Reset pagination when filters change
    dispatch({ type: 'SET_PAGINATION', payload: { currentPage: 1 } });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    // Reset pagination when search changes
    dispatch({ type: 'SET_PAGINATION', payload: { currentPage: 1 } });
  };

  const setSelectedEvent = (event) => {
    dispatch({ type: 'SET_SELECTED_EVENT', payload: event });
  };

  const openModal = (type, data = null) => {
    dispatch({ 
      type: 'SET_MODAL_STATE', 
      payload: { isOpen: true, type, data } 
    });
  };

  const closeModal = () => {
    dispatch({ 
      type: 'SET_MODAL_STATE', 
      payload: { isOpen: false, type: null, data: null } 
    });
    setSelectedEvent(null);
  };

  const setPagination = useCallback((paginationData) => {
    dispatch({ type: 'SET_PAGINATION', payload: paginationData });
  }, []);

  const showNotification = (type, message) => {
    dispatch({ 
      type: 'SET_NOTIFICATION', 
      payload: { type, message } 
    });
    
    // Auto-clear notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  const clearNotification = () => {
    dispatch({ type: 'CLEAR_NOTIFICATION' });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const clearFilters = () => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: {
        category: 'all',
        status: 'all',
        dateRange: 'all'
      }
    });
    setSearchQuery('');
  };

  const getCurrentPageEvents = useCallback((allEvents) => {
    const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
    const endIndex = startIndex + state.pagination.itemsPerPage;
    return allEvents.slice(startIndex, endIndex);
  }, [state.pagination.currentPage, state.pagination.itemsPerPage]);

  const getTotalPages = useCallback((totalItems) => {
    return Math.ceil(totalItems / state.pagination.itemsPerPage);
  }, [state.pagination.itemsPerPage]);

  const value = {
    // State
    viewMode: state.viewMode,
    filters: state.filters,
    searchQuery: state.searchQuery,
    selectedEvent: state.selectedEvent,
    modal: state.modal,
    pagination: state.pagination,
    notification: state.notification,
    loading: state.loading,
    
    // Actions
    setViewMode,
    setFilters,
    setSearchQuery,
    setSelectedEvent,
    openModal,
    closeModal,
    setPagination,
    showNotification,
    clearNotification,
    setLoading,
    clearFilters,
    getCurrentPageEvents,
    getTotalPages
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};