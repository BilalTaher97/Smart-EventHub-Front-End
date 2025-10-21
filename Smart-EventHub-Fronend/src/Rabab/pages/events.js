import React, { useState, useEffect } from "react";
import eventImg from "../images/event1.jpg";
import "../styles/calendar.css";

export default function CalendarPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedOwner, setSelectedOwner] = useState("All");
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
 const [tasks, setTasks] = useState([
  {
    date: "20/Oct/2025",
    time: "08:30 - 09:00",
    title: "Daily Standup",
    color: "#1abc9c",
    owner: "alice@example.com",
    details: "Short team sync to review yesterday’s progress, blockers, and priorities for today. Focus on backend fixes and UI refinements."
  },
  {
    date: "18/Oct/2025",
    time: "09:30 - 10:00",
    title: "Revision UI Design Landing Page",
    color: "#f39c12",
    owner: "bob@example.com",
    details: "Review updated landing page mockups with the design team. Discuss layout consistency, color scheme, and mobile responsiveness."
  },
  {
    date: "08/Oct/2025",
    time: "10:30 - 11:30",
    title: "Duplicate Task",
    color: "#3498db",
    owner: "alice@example.com",
    details: "Verify task duplication logic in the event management system. Test edge cases and log inconsistencies found during QA."
  },
  {
    date: "22/Oct/2025",
    time: "14:00 - 15:00",
    title: "Client Presentation",
    color: "#9b59b6",
    owner: "alice@example.com",
    details: "Present the new event management dashboard to the client. Collect feedback on usability and overall user experience."
  },
  {
    date: "23/Oct/2025",
    time: "11:00 - 12:00",
    title: "Database Optimization",
    color: "#e74c3c",
    owner: "bob@example.com",
    details: "Optimize SQL queries in the analytics module. Identify slow queries and apply indexing improvements for faster load times."
  },
  {
    date: "25/Oct/2025",
    time: "16:00 - 17:30",
    title: "Security Review",
    color: "#2ecc71",
    owner: "alice@example.com",
    details: "Conduct a code-level security audit. Focus on authentication logic, token handling, and permission-based access controls."
  },
  {
    date: "26/Oct/2025",
    time: "09:00 - 10:00",
    title: "QA Testing Session",
    color: "#e67e22",
    owner: "bob@example.com",
    details: "Run full regression tests for new feature deployments. Document all bugs in the tracking system for review and fixing."
  },
  {
    date: "28/Oct/2025",
    time: "13:00 - 14:30",
    title: "Sprint Planning",
    color: "#16a085",
    owner: "alice@example.com",
    details: "Plan the next sprint tasks, assign owners, and estimate effort levels. Review previous sprint metrics and backlog status."
  },
  {
    date: "30/Oct/2025",
    time: "15:30 - 17:00",
    title: "Team Retrospective",
    color: "#2980b9",
    owner: "alice@example.com",
    details: "Reflect on what went well, what didn’t, and how to improve collaboration for the next sprint. Encourage open discussion."
  },
  {
    date: "02/Nov/2025",
    time: "10:00 - 11:00",
    title: "Feature Demo Review",
    color: "#c0392b",
    owner: "bob@example.com",
    details: "Demonstrate new calendar integration and event filtering features. Gather internal feedback before production release."
  }
]);


  const [formData, setFormData] = useState({
    title: "",
    details: "",
    time: "",
    date: "",
    owner: "alice@example.com",
  });

  useEffect(() => {
    document.body.classList.add("events-page");
    return () => document.body.classList.remove("events-page");
  }, []);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const isTodaySelected = selectedDate === today.getDate();

  const startOfWeek = new Date(currentYear, currentMonth, selectedDate);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  function handleFormSubmit(e) {
    e.preventDefault();

    const formattedDate = new Date(formData.date);
    const dateStr = `${formattedDate.getDate()}/${monthNames[formattedDate.getMonth()].slice(0,3)}/${formattedDate.getFullYear()}`;

    // if (editingEvent) {
    //   // update
    //   setTasks(prev =>
    //     prev.map(task =>
    //       task.title === editingEvent.title && task.date === editingEvent.date
    //         ? { ...formData, date: dateStr, color: task.color }
    //         : task
    //     )
    //   );
    // } else {
    //   // add
    //   setTasks(prev => [...prev, { ...formData, date: dateStr, color: "#1abc9c" }]);
    // }

    setShowAddEvent(false);
    setEditingEvent(null);
    setFormData({ title: "", details: "", time: "", date: "", owner: "alice@example.com" });
  }

  return (
    <div className="calendar-page">
      <aside className="sidebar">
        <h3>{monthNames[currentMonth]} {currentYear}</h3>
        <div className="calendar-grid">
          {Array.from({ length: lastDay }, (_, i) => i + 1).map(d => (
            <div
              key={d}
              className={`day ${d === selectedDate ? "active" : ""}`}
              onClick={() => setSelectedDate(d)}
            >
              {d}
            </div>
          ))}
        </div>
      </aside>

      <main className="calendar-main">
        <div className="calendar-header">
          <h2>Week of {monthNames[currentMonth]} {selectedDate}, {currentYear}</h2>
          <button onClick={() => {
            setShowAddEvent(true);
            setEditingEvent(null);
            setFormData({ title: "", details: "", time: "", date: "", owner: "alice@example.com" });
          }}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <div className="calendar-options">
            <button
              className={isTodaySelected ? "active" : ""}
              onClick={() => setSelectedDate(today.getDate())}
            >
              Today
            </button>
            <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)}>
              <option value="All">All</option>
              <option value="alice@example.com">My Events</option>
            </select>
          </div>
        </div>

        <div className="calendar-table">
          <div className="week-grid">
            {weekDates.map(date => {
              const dayShort = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
              const dateStr = `${date.getDate()}/${monthNames[date.getMonth()].slice(0,3)}/${date.getFullYear()}`;
              const dayTasks = tasks
                .filter(t => t.date === dateStr)
                .filter(t => selectedOwner === "All" || t.owner === selectedOwner);

              return (
                <div key={dateStr} className="day-column">
                  <div className="day-header">{dayShort}</div>
                  <div className="events">
                    {dayTasks.map((t,i) => (
                      <div
                        key={i}
                        className="event"
                        style={{ backgroundColor: t.color }}
                        onClick={() => setSelectedEvent(t)}
                      >
                        <strong>{t.title}</strong>
                        <p>{t.time}</p>
                        <small>{t.owner}</small>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showAddEvent && (
          <section className="add-event">
            <div className="add-event-container">
              <div className="title">
                {editingEvent ? "Edit Event" : "Add Event"}
                <span>
                  <i className="fa fa-times" onClick={() => {
                    setShowAddEvent(false);
                    setEditingEvent(null);
                  }}></i>
                </span>
              </div>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Event Details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Event Time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
                <small>ex. 08:30 - 09:00</small>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <input type="submit" value={editingEvent ? "Update" : "Add"} />
              </form>
            </div>
          </section>
        )}

        {selectedEvent && (
          <div className="container">
            <div className="event-details">
              <span className="close" onClick={() => setSelectedEvent(null)}>
                <i className="fa-solid fa-circle-xmark"></i>
              </span>
              <div className="img-fluid">
                <img src={eventImg} alt="Event" />
                <span className="date">
                  <span>{selectedEvent.date.split("/")[0]}</span>
                  <span>{selectedEvent.date.split("/")[1]}</span>
                </span>
              </div>
              <div className="details">
                <div className="row">
                  <div className="name">{selectedEvent.title}</div>
                  <div className="time">
                    <i className="fa fa-clock"> {selectedEvent.time}</i>
                  </div>
                </div>
                <div className="row">
                  <div className="det">{selectedEvent.details}</div>
                </div>
                <button
                  className={`edit-btn ${
                    selectedEvent.owner === "alice@example.com" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (selectedEvent.owner === "alice@example.com") {
                      setEditingEvent(selectedEvent);
                      setFormData({
                        title: selectedEvent.title,
                        details: selectedEvent.details,
                        time: selectedEvent.time,
                        date: "",
                        owner: selectedEvent.owner,
                      });
                      setShowAddEvent(true);
                      setSelectedEvent(null);
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className={`join-btn ${
                    selectedEvent.owner !== "alice@example.com" ? "active" : ""
                  }`}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
