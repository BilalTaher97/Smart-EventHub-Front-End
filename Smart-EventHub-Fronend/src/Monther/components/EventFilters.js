import React from 'react';
import { useAdmin } from '../contexts/AdminContext';

const EventFilters = () => {
  const { 
    filters, 
    searchQuery, 
    viewMode, 
    setFilters, 
    setSearchQuery, 
    setViewMode, 
    clearFilters,
    openModal 
  } = useAdmin();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const hasActiveFilters = () => {
    return (
      searchQuery.trim() || 
      filters.category !== 'all' || 
      filters.status !== 'all' || 
      filters.dateRange !== 'all'
    );
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'training', label: 'Training' },
    { value: 'networking', label: 'Networking' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'past', label: 'Past' }
  ];

  const dateRanges = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'upcoming', label: 'Upcoming Only' },
    { value: 'past', label: 'Past Only' }
  ];

  return (
    <div className="admin-controls">
      <div className="admin-controls-left">
        {/* Search */}
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search events by title, description, or location..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button 
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters-container">
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {hasActiveFilters() && (
            <button 
              className="btn btn-secondary clear-filters-btn"
              onClick={handleClearFilters}
              title="Clear all filters"
            >
              <i className="fas fa-times"></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="admin-controls-right">
        {/* View Mode Toggle */}
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <i className="fas fa-list"></i>
          </button>
        </div>

        {/* Create New Event Button */}
        <button 
          className="btn btn-primary"
          onClick={() => openModal('create')}
        >
          <i className="fas fa-plus"></i>
          New Event
        </button>
      </div>

      <style jsx>{`
        .search-clear-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          transition: var(--admin-transition);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .search-clear-btn:hover {
          background: #f0f0f0;
          color: var(--admin-dark-blue);
        }

        .clear-filters-btn {
          background: var(--admin-pink) !important;
          color: white !important;
          border-color: var(--admin-pink) !important;
        }

        .clear-filters-btn:hover {
          background: #d91e5a !important;
          border-color: #d91e5a !important;
          transform: translateY(-2px);
        }

        .filters-container {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        @media screen and (max-width: 800px) {
          .admin-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .admin-controls-left,
          .admin-controls-right {
            width: 100%;
            justify-content: center;
          }

          .search-container {
            min-width: auto;
            width: 100%;
            max-width: 400px;
          }

          .filters-container {
            justify-content: center;
            gap: 0.5rem;
          }

          .filter-select {
            min-width: 100px;
            flex: 1;
          }

          .admin-controls-right {
            justify-content: space-between;
          }
        }

        @media screen and (max-width: 600px) {
          .filters-container {
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .filter-select {
            width: 100%;
            min-width: auto;
          }

          .clear-filters-btn {
            width: 100%;
          }

          .admin-controls-right {
            flex-direction: column;
            gap: 1rem;
          }

          .view-toggle {
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
};

export default EventFilters;