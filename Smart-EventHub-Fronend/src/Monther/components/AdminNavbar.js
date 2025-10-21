import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { openModal } = useAdmin();
  const [menuActive, setMenuActive] = useState(false);
  const [activeLink, setActiveLink] = useState('Events');

  const handleLogout = () => {
    // Simple logout - redirect to auth page
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

  return (
    <nav className="admin-nav">
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
  );
};

export default AdminNavbar;