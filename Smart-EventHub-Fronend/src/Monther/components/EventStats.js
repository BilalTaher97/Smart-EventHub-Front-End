import React, { useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';

const EventStats = () => {
  const { events } = useEvents();

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() + 7);
    const thisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const upcomingEvents = events.filter(event => new Date(event.date) >= today);
    const pastEvents = events.filter(event => new Date(event.date) < today);
    const thisWeekEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= thisWeek;
    });
    const thisMonthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === today.getFullYear() && 
             eventDate.getMonth() === today.getMonth();
    });

    const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
    const totalCapacity = events.reduce((sum, event) => sum + event.maxAttendees, 0);
    const averageAttendance = totalCapacity > 0 ? (totalAttendees / totalCapacity) * 100 : 0;

    const totalRevenue = events.reduce((sum, event) => {
      return sum + (event.price * event.attendees);
    }, 0);

    // Category distribution
    const categoryStats = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {});

    const mostPopularCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];

    return {
      total: events.length,
      upcoming: upcomingEvents.length,
      past: pastEvents.length,
      thisWeek: thisWeekEvents.length,
      thisMonth: thisMonthEvents.length,
      totalAttendees,
      totalCapacity,
      averageAttendance: Math.round(averageAttendance),
      totalRevenue,
      mostPopularCategory: mostPopularCategory ? mostPopularCategory[0] : 'N/A',
      categoryStats
    };
  }, [events]);

  const statCards = [
    {
      icon: 'fas fa-calendar',
      label: 'Total Events',
      value: stats.total,
      color: 'var(--admin-light-blue)',
      bgColor: 'rgba(23, 20, 115, 0.1)'
    },
    {
      icon: 'fas fa-calendar-plus',
      label: 'Upcoming Events',
      value: stats.upcoming,
      color: 'var(--admin-pink)',
      bgColor: 'rgba(242, 41, 115, 0.1)'
    },
    {
      icon: 'fas fa-users',
      label: 'Total Attendees',
      value: stats.totalAttendees.toLocaleString(),
      color: '#28a745',
      bgColor: 'rgba(40, 167, 69, 0.1)'
    },
    {
      icon: 'fas fa-percentage',
      label: 'Avg Attendance',
      value: `${stats.averageAttendance}%`,
      color: '#17a2b8',
      bgColor: 'rgba(23, 162, 184, 0.1)'
    },
    {
      icon: 'fas fa-dollar-sign',
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: '#ffc107',
      bgColor: 'rgba(255, 193, 7, 0.1)'
    },
    {
      icon: 'fas fa-star',
      label: 'Popular Category',
      value: stats.mostPopularCategory,
      color: '#6f42c1',
      bgColor: 'rgba(111, 66, 193, 0.1)'
    }
  ];

  const quickStats = [
    {
      label: 'This Week',
      value: stats.thisWeek,
      icon: 'fas fa-calendar-week',
      color: 'var(--admin-light-blue)'
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: 'fas fa-calendar-alt',
      color: 'var(--admin-pink)'
    },
    {
      label: 'Past Events',
      value: stats.past,
      icon: 'fas fa-history',
      color: '#6c757d'
    }
  ];

  return (
    <div className="stats-section">
      {/* Main Statistics Cards */}
      <div className="stats-container">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ backgroundColor: stat.bgColor }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <div className="stat-number" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats">
        <h3 className="quick-stats-title">Quick Overview</h3>
        <div className="quick-stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="quick-stat-item">
              <div className="quick-stat-icon" style={{ color: stat.color }}>
                <i className={stat.icon}></i>
              </div>
              <div className="quick-stat-content">
                <span className="quick-stat-number">{stat.value}</span>
                <span className="quick-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.categoryStats).length > 0 && (
        <div className="category-breakdown">
          <h3 className="breakdown-title">Events by Category</h3>
          <div className="category-list">
            {Object.entries(stats.categoryStats)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count} events</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-bar-fill"
                      style={{ 
                        width: `${(count / stats.total) * 100}%`,
                        backgroundColor: `hsl(${Object.keys(stats.categoryStats).indexOf(category) * 45}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="category-percentage">
                    {Math.round((count / stats.total) * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .stats-section {
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: var(--admin-border-radius);
          border: 2px solid transparent;
          transition: var(--admin-transition);
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--admin-shadow-hover);
          border-color: rgba(23, 20, 115, 0.2);
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
        }

        .quick-stats {
          background: white;
          padding: 1.5rem;
          border-radius: var(--admin-border-radius);
          box-shadow: var(--admin-shadow);
          margin-bottom: 2rem;
        }

        .quick-stats-title {
          color: var(--admin-dark-blue);
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .quick-stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: var(--admin-border-radius);
          transition: var(--admin-transition);
        }

        .quick-stat-item:hover {
          background: #e9ecef;
          transform: translateY(-1px);
        }

        .quick-stat-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .quick-stat-content {
          display: flex;
          flex-direction: column;
        }

        .quick-stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--admin-dark-blue);
          line-height: 1;
        }

        .quick-stat-label {
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .category-breakdown {
          background: white;
          padding: 1.5rem;
          border-radius: var(--admin-border-radius);
          box-shadow: var(--admin-shadow);
        }

        .breakdown-title {
          color: var(--admin-dark-blue);
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .category-item {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          gap: 1rem;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .category-item:last-child {
          border-bottom: none;
        }

        .category-info {
          display: flex;
          flex-direction: column;
        }

        .category-name {
          font-weight: 600;
          color: var(--admin-dark-blue);
        }

        .category-count {
          color: #666;
          font-size: 0.9rem;
        }

        .category-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .category-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: var(--admin-transition);
        }

        .category-percentage {
          font-weight: 600;
          color: var(--admin-dark-blue);
          min-width: 50px;
          text-align: right;
        }

        @media screen and (max-width: 800px) {
          .stats-container {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          .stat-card {
            flex-direction: column;
            text-align: center;
          }

          .quick-stats-grid {
            grid-template-columns: 1fr;
          }

          .category-item {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            text-align: center;
          }

          .category-info {
            align-items: center;
          }

          .category-percentage {
            text-align: center;
          }
        }

        @media screen and (max-width: 600px) {
          .stats-container {
            grid-template-columns: 1fr;
          }

          .stat-icon {
            font-size: 2rem;
            width: 50px;
            height: 50px;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .quick-stat-icon {
            font-size: 1.25rem;
            width: 35px;
            height: 35px;
          }

          .quick-stat-number {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EventStats;