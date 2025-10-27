import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { useAdmin } from '../contexts/AdminContext';
import '../styles/admin.css';
import '../styles/event-detail.css';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const { openModal } = useAdmin();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuActive, setMenuActive] = useState(false);
  const [activeLink, setActiveLink] = useState('Events');

  useEffect(() => {
    const eventData = getEventById(id);
    if (eventData) {
      setEvent(eventData);
    } else {
      // If event not found, redirect back to admin
      navigate('/admin');
    }
  }, [id, getEventById, navigate]);

  if (!event) {
    return (
      <div className="event-detail-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading event details...</span>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const calculateRevenue = () => {
    return (event.attendees * event.price).toLocaleString();
  };

  const calculateEngagement = () => {
    if (!event.maxAttendees) return 0;
    return Math.round((event.attendees / event.maxAttendees) * 100);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleCreateEvent = () => {
    openModal('create');
    setMenuActive(false);
  };

  const handleLinkClick = (name, action) => {
    setActiveLink(name);
    setMenuActive(false);
    if (action) action();
  };

  const navItems = [
    { name: 'Events', action: () => navigate('/admin') },
    { name: 'Calendar', action: null },
    { name: 'Analytics', action: null },
    { name: 'Create Event', action: handleCreateEvent },
    { name: 'Logout', action: handleLogout }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'guests', label: 'Guests' },
    { id: 'registration', label: 'Registration' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
    { id: 'more', label: 'More' }
  ];

  return (
    <div className="event-detail-page">
      {/* Header Navigation */}
      <nav className="event-detail-nav">
        <div className="nav-center">
          <div className="nav-header">
            <img src={require("../../Rabab/images/logo (2).png")} alt="logo" />
            <span>Events Hub</span>
            <button
              className="nav-toggle"
              onClick={() => setMenuActive((prev) => !prev)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          <ul className={`links ${menuActive ? "show-links" : ""}`}>
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={activeLink === item.name ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.name, item.action);
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="event-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span 
            className="breadcrumb-link"
            onClick={() => navigate('/admin')}
          >
            Personal
          </span>
          <i className="fas fa-chevron-right"></i>
          <span className="breadcrumb-current">{event.title}</span>
        </div>

        {/* Event Title & Actions */}
        <div className="event-title-section">
          <h1 className="event-title">{event.title}</h1>
          <button className="event-page-btn">
            Event Page <i className="fas fa-external-link-alt"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="event-detail-content">
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn invite-btn">
              <i className="fas fa-envelope"></i>
              Invite Guests
            </button>
            <button className="action-btn update-btn">
              <i className="fas fa-bullhorn"></i>
              Send Update
            </button>
            <button className="action-btn share-btn">
              <i className="fas fa-share-alt"></i>
              Share Event
            </button>
          </div>

          <div className="event-content-grid">
            {/* Event Visual Card */}
            <div className="event-visual-card">
              <div className="event-visual">
                {/* Abstract Elements */}
                <div className="abstract-element element-1"></div>
                <div className="abstract-element element-2"></div>
                <div className="abstract-element element-3"></div>
                <div className="abstract-element element-4"></div>
                <div className="abstract-element element-5"></div>
                
                {/* Central Eye Element */}
                <div className="central-element">
                  <div className="eye-outer">
                    <div className="eye-inner"></div>
                  </div>
                </div>
              </div>
              
              <div className="event-card-info">
                <h3 className="event-card-title">{event.title}</h3>
                <div className="event-card-meta">
                  <div className="event-date">
                    <i className="fas fa-calendar"></i>
                    {event.date === event.endDate 
                      ? formatDate(event.date)
                      : `${formatDate(event.date)} - ${formatDate(event.endDate)}`
                    }
                  </div>
                  <div className="event-time">
                    {formatTime(event.time)} GMT+3
                  </div>
                </div>
                <div className="event-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{event.location}</span>
                </div>
                
                <div className="registration-section">
                  <h4>REGISTRATION</h4>
                  <p>Welcome! Join the conference below.</p>
                  <button className="rsvp-btn">RSVP Now</button>
                </div>
              </div>
            </div>

            {/* When & Where + Statistics */}
            <div className="event-info-section">
              {/* When & Where */}
              <div className="when-where-section">
                <h3>When & Where</h3>
                <div className="date-info">
                  <div className="date-display">
                    <span className="month">NOV</span>
                    <span className="day">19</span>
                    <span className="year">25</span>
                  </div>
                  <div className="date-details">
                    <h4>Multiple Days</h4>
                    <p>{formatTime(event.time)} - 6:00 PM GMT+3</p>
                  </div>
                </div>
                <div className="location-info">
                  <i className="fas fa-map-marker-alt"></i>
                  <div className="location-details">
                    <h4>{event.location}</h4>
                    <p>Amman, Jordan</p>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="statistics-section">
                <div className="stat-card registered">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{event.attendees}</span>
                    <span className="stat-label">Registered</span>
                  </div>
                </div>
                
                <div className="stat-card revenue">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">${calculateRevenue()}</span>
                    <span className="stat-label">Revenue</span>
                  </div>
                </div>
                
                <div className="stat-card engagement">
                  <div className="stat-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{calculateEngagement()}%</span>
                    <span className="stat-label">Engagement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Management Footer */}
          <div className="event-management-footer">
            <h3>Event Management</h3>
            <p>Manage attendees, send updates, and track event performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;