import React, { useEffect } from 'react';
import { AdminProvider } from '../contexts/AdminContext';
import { useAdmin } from '../contexts/AdminContext';
import AdminNavbar from '../components/AdminNavbar';
import EventStats from '../components/EventStats';
import EventFilters from '../components/EventFilters';
import EventList from '../components/EventList';
import EventModal from '../components/EventModal';
import '../styles/admin.css';

const Notification = () => {
  const { notification, clearNotification } = useAdmin();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      <div className="notification-content">
        <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' :
            notification.type === 'error' ? 'fa-exclamation-circle' :
              'fa-info-circle'
          }`}></i>
        <span>{notification.message}</span>
      </div>
      <button
        className="notification-close"
        onClick={clearNotification}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

const AdminDashboardContent = () => {
  const { loading } = useAdmin();

  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => document.body.classList.remove('admin-page');
  }, []);

  return (
    <div className="admin-page">
      <AdminNavbar />

      <div className="admin-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="breadcrumb-current">Personal</span>
          <i className="fas fa-chevron-right"></i>
          <span className="breadcrumb-current">Events</span>
        </div>

        {/* Page Title & Description */}
        <div className="admin-title-section">
          <h1 className="admin-title">Events Management Dashboard</h1>
          <p className="admin-subtitle">
            Manage your events, track attendance, and monitor performance
          </p>
        </div>

        <main className="admin-main">
          {/* Statistics Section */}
          <EventStats />

          {/* Controls and Filters */}
          <EventFilters />

          {/* Events List */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Loading events...</span>
              </div>
            </div>
          ) : (
            <EventList />
          )}
        </main>
      </div>

      {/* Modal */}
      <EventModal />

      {/* Notification */}
      <Notification />

      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--admin-border-radius);
          box-shadow: var(--admin-shadow);
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--admin-light-blue);
        }

        .loading-spinner i {
          font-size: 3rem;
        }

        .loading-spinner span {
          font-size: 1.1rem;
          font-weight: 500;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .notification-content i {
          font-size: 1.2rem;
        }

        @media screen and (max-width: 800px) {
          .admin-title {
            font-size: 1.5rem;
          }

          .admin-subtitle {
            font-size: 0.9rem;
          }

          .loading-spinner i {
            font-size: 2rem;
          }

          .loading-spinner span {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
};

export default AdminDashboard;