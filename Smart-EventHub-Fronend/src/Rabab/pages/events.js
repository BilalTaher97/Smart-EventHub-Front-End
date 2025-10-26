import React, { useState, useEffect } from "react";
import eventImg from "../images/event1.jpg";
import "../styles/calendar.css";

export default function CalendarPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedOwner, setSelectedOwner] = useState("All");
  // const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // const [editingEvent, setEditingEvent] = useState(null);
  const [tasks, setTasks] = useState([]);

useEffect(() => {
  fetch("http://localhost:3000/api/events")
    .then(res => res.json())
    .then(data => {
      if (data && data.data) {
        const mappedTasks = data.data.map(event => {
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
        setTasks(mappedTasks);
      }
    })
    .catch(err => console.error("Failed to fetch events", err));
}, []);


  // const [formData, setFormData] = useState({
  //   title: "",
  //   details: "",
  //   time: "",
  //   date: "",
  //   owner: ""
  // });

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

  // function handleFormSubmit(e) {
  //   e.preventDefault();

  //   // const formattedDate = new Date(formData.date);
  //   // const dateStr = `${formattedDate.getDate()}/${monthNames[formattedDate.getMonth()].slice(0,3)}/${formattedDate.getFullYear()}`;

  //   // if (editingEvent) {
  //   //   // update
  //   //   setTasks(prev =>
  //   //     prev.map(task =>
  //   //       task.title === editingEvent.title && task.date === editingEvent.date
  //   //         ? { ...formData, date: dateStr, color: task.color }
  //   //         : task
  //   //     )
  //   //   );
  //   // } else {
  //   //   // add
  //   //   setTasks(prev => [...prev, { ...formData, date: dateStr, color: "#1abc9c" }]);
  //   // }

  //   // setShowAddEvent(false);
  //   // setEditingEvent(null);
  //   // setFormData({ title: "", details: "", time: "", date: "", owner: "" });
  // }

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
          {/* <button onClick={() => {
            // setShowAddEvent(true);
            setEditingEvent(null);
            setFormData({ title: "", details: "", time: "", date: "", owner: "alice@example.com" });
          }}>
            <i className="fa-solid fa-plus"></i>
          </button> */}
          <div className="calendar-options">
            <button
              className={isTodaySelected ? "active" : ""}
              onClick={() => setSelectedDate(today.getDate())}
            >
              Today
            </button>
            <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)}>
              <option value="All">All</option>
              <option value={localStorage.getItem("userId")}>My Events</option>
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
    selectedEvent.owner !== localStorage.getItem("userEmail") &&
    new Date(selectedEvent.date.split("/").reverse().join("-")) >= today
      ? "active"
      : ""
  }`}
  onClick={() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login first");

    const eventDate = new Date(selectedEvent.date.split("/").reverse().join("-"));
    if (eventDate < today) return alert("Cannot join past events");

    const ticketData = {
      userId: parseInt(userId),
      eventId: selectedEvent.eventId,
      qrCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: "active"
    };

    fetch(`http://localhost:3000/api/tickets/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData)
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Ticket created successfully");
    })
    .catch(err => {
      console.error(err);
      alert("Failed to create ticket");
    });
  }}
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
