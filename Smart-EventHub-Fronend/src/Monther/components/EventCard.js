import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const EventCard = ({ event, onEdit, onDelete, onView }) => {
  const { openModal } = useAdmin();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    if (startDate === endDate) {
      return formatDate(startDate);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'var(--light-blue)';
      case 'ongoing':
        return '#F22973';
      case 'past':
        return '#c4c3ca';
      default:
        return 'var(--dark-blue)';
    }
  };

  const calculateDaysUntil = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const handleQuickAction = (action, e) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        openModal('edit', event);
        break;
      case 'delete':
        openModal('delete', event);
        break;
      case 'view':
        navigate(`/admin/events/${event.id}`);
        break;
      default:
        break;
    }
  };

  const attendancePercentage = event.maxAttendees ? 
    Math.round((event.attendees / event.maxAttendees) * 100) : 0;

  return (
    <div className="event-card" onClick={(e) => handleQuickAction('view', e)}>
      <div className="event-card-header">
        <div className="event-image">
          {event.image ? (
            <img src={event.image} alt={event.title} />
          ) : (
            <div className="event-image-placeholder">
              <i className="fas fa-calendar-alt"></i>
            </div>
          )}
          <div className="event-status" style={{ backgroundColor: getStatusColor(event.status) }}>
            {event.status}
          </div>
        </div>
        <div className="event-actions">
          <button 
            className="action-btn view-btn" 
            onClick={(e) => handleQuickAction('view', e)}
            title="View Details"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button 
            className="action-btn edit-btn" 
            onClick={(e) => handleQuickAction('edit', e)}
            title="Edit Event"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={(e) => handleQuickAction('delete', e)}
            title="Delete Event"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className="event-card-body">
        <div className="event-meta">
          <span className="event-category">{event.category}</span>
          <span className="event-countdown">{calculateDaysUntil(event.date)}</span>
        </div>
        
        <h3 className="event-title">{event.title}</h3>
        
        <p className="event-description">
          {event.description.length > 100 
            ? `${event.description.substring(0, 100)}...` 
            : event.description}
        </p>

        <div className="event-details">
          <div className="event-detail">
            <i className="fas fa-calendar"></i>
            <span>{formatDateRange(event.date, event.endDate)}</span>
          </div>
          
          <div className="event-detail">
            <i className="fas fa-clock"></i>
            <span>{event.time}</span>
          </div>
          
          <div className="event-detail">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.location}</span>
          </div>

          <div className="event-detail">
            <i className="fas fa-users"></i>
            <span>{event.attendees} / {event.maxAttendees} attendees</span>
          </div>

          {event.price > 0 && (
            <div className="event-detail">
              <i className="fas fa-dollar-sign"></i>
              <span>${event.price}</span>
            </div>
          )}
        </div>

        <div className="event-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">{attendancePercentage}% filled</span>
        </div>
      </div>

      <div className="event-card-footer">
        <div className="event-timestamps">
          <span>Created: {formatDate(event.createdAt)}</span>
          {event.updatedAt !== event.createdAt && (
            <span>Updated: {formatDate(event.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;