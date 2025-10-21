import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useEvents } from '../contexts/EventsContext';
import EventForm from './EventForm';

const EventModal = () => {
  const { modal, closeModal, showNotification } = useAdmin();
  const { deleteEvent } = useEvents();

  if (!modal.isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleDeleteConfirm = () => {
    const result = deleteEvent(modal.data.id);
    if (result.success) {
      showNotification('success', result.message);
      closeModal();
    } else {
      showNotification('error', result.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderModalContent = () => {
    switch (modal.type) {
      case 'create':
        return <EventForm />;

      case 'edit':
        return <EventForm event={modal.data} />;

      case 'view':
        return (
          <div className="event-details-modal">
            <div className="modal-header">
              <h2>Event Details</h2>
              <button
                className="modal-close-btn"
                onClick={closeModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="event-details-content">
              {modal.data.image && (
                <div className="event-detail-image">
                  <img src={modal.data.image} alt={modal.data.title} />
                </div>
              )}

              <div className="event-detail-header">
                <div className="event-detail-meta">
                  <span className="event-detail-category">{modal.data.category}</span>
                  <span className={`event-detail-status status-${modal.data.status}`}>
                    {modal.data.status}
                  </span>
                </div>
                <h1 className="event-detail-title">{modal.data.title}</h1>
              </div>

              <div className="event-detail-description">
                <h3>Description</h3>
                <p>{modal.data.description}</p>
              </div>

              <div className="event-detail-info">
                <div className="info-grid">
                  <div className="info-item">
                    <i className="fas fa-calendar"></i>
                    <div>
                      <strong>Date</strong>
                      <span>
                        {modal.data.date === modal.data.endDate
                          ? formatDate(modal.data.date)
                          : `${formatDate(modal.data.date)} - ${formatDate(modal.data.endDate)}`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <strong>Time</strong>
                      <span>{formatTime(modal.data.time)}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong>Location</strong>
                      <span>{modal.data.location}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <i className="fas fa-users"></i>
                    <div>
                      <strong>Attendees</strong>
                      <span>{modal.data.attendees} / {modal.data.maxAttendees}</span>
                    </div>
                  </div>

                  {modal.data.price > 0 && (
                    <div className="info-item">
                      <i className="fas fa-dollar-sign"></i>
                      <div>
                        <strong>Price</strong>
                        <span>${modal.data.price}</span>
                      </div>
                    </div>
                  )}

                  <div className="info-item">
                    <i className="fas fa-calendar-plus"></i>
                    <div>
                      <strong>Created</strong>
                      <span>{formatDate(modal.data.createdAt)}</span>
                    </div>
                  </div>

                  {modal.data.updatedAt !== modal.data.createdAt && (
                    <div className="info-item">
                      <i className="fas fa-edit"></i>
                      <div>
                        <strong>Last Updated</strong>
                        <span>{formatDate(modal.data.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="event-detail-progress">
                <h3>Registration Progress</h3>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.round((modal.data.attendees / modal.data.maxAttendees) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="progress-percentage">
                    {Math.round((modal.data.attendees / modal.data.maxAttendees) * 100)}% filled
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="delete-confirmation-modal">
            <div className="modal-header">
              <h2>Delete Event</h2>
            </div>

            <div className="delete-confirmation-content">
              <div className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>

              <h3>Are you sure you want to delete this event?</h3>

              <div className="event-summary">
                <strong>{modal.data.title}</strong>
                <span>{formatDate(modal.data.date)} at {modal.data.location}</span>
              </div>

              <div className="warning-message">
                <p>
                  This action cannot be undone. All event data including attendee
                  registrations will be permanently deleted.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
              >
                <i className="fas fa-trash"></i>
                Delete Event
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-content ${modal.type === 'create' || modal.type === 'edit' ? 'modal-content-large' : ''}`}>
        {renderModalContent()}
      </div>

      <style jsx>{`
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .modal-header h2 {
          margin: 0;
          color: var(--admin-dark-blue);
          font-weight: 600;
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #666;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: var(--admin-transition);
        }

        .modal-close-btn:hover {
          background: #f0f0f0;
          color: var(--admin-dark-blue);
        }

        .event-details-content {
          padding: 2rem;
        }

        .event-detail-image {
          width: 100%;
          height: 200px;
          border-radius: var(--admin-border-radius);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .event-detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-detail-header {
          margin-bottom: 2rem;
        }

        .event-detail-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .event-detail-category {
          background: var(--admin-light-blue);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .event-detail-status {
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-upcoming {
          background: #d4edda;
          color: #155724;
        }

        .status-ongoing {
          background: #f8d7da;
          color: #721c24;
        }

        .status-past {
          background: #e2e3e5;
          color: #6c757d;
        }

        .event-detail-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--admin-dark-blue);
          margin: 0;
          line-height: 1.3;
        }

        .event-detail-description h3 {
          color: var(--admin-dark-blue);
          margin-bottom: 0.75rem;
        }

        .event-detail-description p {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .event-detail-info {
          margin: 2rem 0;
        }

        .event-detail-info h3 {
          color: var(--admin-dark-blue);
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--admin-border-radius);
        }

        .info-item i {
          color: var(--admin-light-blue);
          width: 20px;
          margin-top: 0.25rem;
        }

        .info-item div {
          display: flex;
          flex-direction: column;
        }

        .info-item strong {
          color: var(--admin-dark-blue);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .info-item span {
          color: #666;
        }

        .event-detail-progress h3 {
          color: var(--admin-dark-blue);
          margin-bottom: 1rem;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          flex: 1;
          height: 12px;
          background: #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--admin-light-blue), var(--admin-pink));
          border-radius: 6px;
          transition: var(--admin-transition);
        }

        .progress-percentage {
          font-weight: 600;
          color: var(--admin-dark-blue);
          min-width: 70px;
        }

        .delete-confirmation-content {
          padding: 2rem;
          text-align: center;
        }

        .warning-icon {
          font-size: 4rem;
          color: #dc3545;
          margin-bottom: 1.5rem;
        }

        .delete-confirmation-content h3 {
          color: var(--admin-dark-blue);
          margin-bottom: 1.5rem;
        }

        .event-summary {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: var(--admin-border-radius);
          margin-bottom: 1.5rem;
        }

        .event-summary strong {
          display: block;
          color: var(--admin-dark-blue);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .event-summary span {
          color: #666;
        }

        .warning-message {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 1rem;
          border-radius: var(--admin-border-radius);
          text-align: left;
        }

        .warning-message p {
          margin: 0;
          color: #856404;
          line-height: 1.5;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 2px solid #e0e0e0;
          background: #f8f9fa;
        }

        @media screen and (max-width: 600px) {
          .event-details-content {
            padding: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .event-detail-title {
            font-size: 1.5rem;
          }

          .modal-header,
          .modal-footer {
            padding: 1rem;
          }

          .delete-confirmation-content {
            padding: 1rem;
          }

          .progress-container {
            flex-direction: column;
            gap: 0.5rem;
          }

          .progress-percentage {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default EventModal;