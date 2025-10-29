import React, { useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useAdmin } from '../contexts/AdminContext';
import EventCard from './EventCard';

const EventList = () => {
  const { events } = useEvents();
  const { 
    viewMode, 
    filters, 
    searchQuery, 
    pagination, 
    setPagination,
    getCurrentPageEvents,
    getTotalPages 
  } = useAdmin();

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => 
        event.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        
        switch (filters.dateRange) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'this-week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= weekFromNow;
          case 'this-month':
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            return eventDate >= monthStart && eventDate <= monthEnd;
          case 'upcoming':
            return eventDate >= today;
          case 'past':
            return eventDate < today;
          default:
            return true;
        }
      });
    }

    // Sort events by date (upcoming first, then by date)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const now = new Date();

      // If both are upcoming or both are past, sort by date
      if ((dateA >= now && dateB >= now) || (dateA < now && dateB < now)) {
        return dateA - dateB;
      }
      
      // Upcoming events come first
      return dateA >= now ? -1 : 1;
    });

    return filtered;
  }, [events, searchQuery, filters]);

  // Update pagination when filtered events change
  React.useEffect(() => {
    setPagination({
      totalItems: filteredEvents.length,
      currentPage: Math.min(pagination.currentPage, getTotalPages(filteredEvents.length) || 1)
    });
  }, [filteredEvents.length, setPagination]);

  const currentPageEvents = getCurrentPageEvents(filteredEvents);
  const totalPages = getTotalPages(filteredEvents.length);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination({ currentPage: newPage });
      // Scroll to top of events list
      document.querySelector('.events-container')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const current = pagination.currentPage;
      const start = Math.max(1, current - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <i className="fas fa-calendar-times"></i>
          <h3>No Events Found</h3>
          <p>
            {searchQuery.trim() || filters.category !== 'all' || filters.status !== 'all' || filters.dateRange !== 'all'
              ? 'No events match your current filters. Try adjusting your search criteria.'
              : 'No events have been created yet. Create your first event to get started!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-summary">
        <span className="results-count">
          Showing {currentPageEvents.length} of {filteredEvents.length} events
        </span>
        {(searchQuery.trim() || filters.category !== 'all' || filters.status !== 'all' || filters.dateRange !== 'all') && (
          <span className="filter-indicator">
            <i className="fas fa-filter"></i>
            Filtered results
          </span>
        )}
      </div>

      <div className={`events-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
        {currentPageEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>

          <div className="pagination-numbers">
            {getPaginationNumbers().map((page, index) => (
              <button
                key={index}
                className={`pagination-number ${
                  page === pagination.currentPage ? 'active' : ''
                } ${page === '...' ? 'ellipsis' : ''}`}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages}
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      <div className="pagination-info">
        <span>
          Page {pagination.currentPage} of {totalPages} 
          ({filteredEvents.length} total events)
        </span>
      </div>
    </div>
  );
};

export default EventList;