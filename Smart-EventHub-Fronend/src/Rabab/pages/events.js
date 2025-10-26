import React, { useState, useEffect } from "react";
import axios from "axios";
import eventImg from "../images/event1.jpg";
import "../styles/calendar.css";

export default function CalendarPage() {
  const today = new Date();
  const userId = parseInt(localStorage.getItem("userId"));
  const accessToken = localStorage.getItem("accessToken");

  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedOwner, setSelectedOwner] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [joinedEventIds, setJoinedEventIds] = useState([]);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all events
        const eventRes = await axios.get("http://localhost:3000/api/events", {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        const events = eventRes.data.data.map(event => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          const dateStr = `${start.getDate()}/${monthNames[start.getMonth()].slice(0,3)}/${start.getFullYear()}`;
          const timeStr = `${start.getHours()}:${start.getMinutes().toString().padStart(2,'0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2,'0')}`;
          return {
            date: dateStr,
            time: timeStr,
            title: event.title,
            color: "#1abc9c",
            owner: event.createdBy,
            details: event.description,
            speakers: event.speakers || [],
            eventId: event.eventId
          };
        });

        setTasks(events);

        // Fetch user tickets
        if (userId) {
          const ticketRes = await axios.get(`http://localhost:3000/api/tickets/user/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setJoinedEventIds(ticketRes.data.data.map(t => t.eventId));
        }

      } catch (err) {
        console.error("Failed to fetch events or tickets:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.body.classList.add("events-page");
    return () => document.body.classList.remove("events-page");
  }, []);

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

  async function handleJoin(event) {
    if (!userId) return alert("Please login first");

    if (event.owner === userId || joinedEventIds.includes(event.eventId)) {
      return; // cannot join
    }

    const ticketData = {
      userId: userId,
      eventId: event.eventId,
      qrCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: "active"
    };

    try {
      const res = await axios.post(
        `http://localhost:3000/api/tickets/user/${userId}`,
        ticketData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert(res.data.message || "Ticket created successfully");
      setJoinedEventIds(prev => [...prev, event.eventId]); // mark as joined
    } catch (err) {
      console.error(err);
      alert("Failed to create ticket");
    }
  }

  const filteredTasks = tasks.filter(t =>
    selectedOwner === "All" ? true : joinedEventIds.includes(t.eventId)
  );

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
          <div className="calendar-options">
            <button
              className={isTodaySelected ? "active" : ""}
              onClick={() => setSelectedDate(today.getDate())}
            >
              Today
            </button>
            <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)}>
              <option value="All">All</option>
              <option value="My">My Events</option>
            </select>
          </div>
        </div>

        <div className="calendar-table">
          <div className="week-grid">
            {weekDates.map(date => {
              const dayShort = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
              const dateStr = `${date.getDate()}/${monthNames[date.getMonth()].slice(0,3)}/${date.getFullYear()}`;
              const dayTasks = filteredTasks.filter(t => t.date === dateStr);

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
                        <p>{t.details}</p>
                        <p>{t.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                  <div className="row speakers">
                    <h4>Speakers:</h4>
                    <ul>
                      {selectedEvent.speakers.map(s => (
                        <li key={s.speakerId}>{s.name} ({s.email})</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className={`join-btn ${
                    selectedEvent.owner === userId ||
                    joinedEventIds.includes(selectedEvent.eventId)
                      ? ""
                      : "active"
                  }`}
                  onClick={() => handleJoin(selectedEvent)}
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
