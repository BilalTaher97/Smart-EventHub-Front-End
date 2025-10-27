import React, { useState, useEffect } from "react";
import axios from "axios";
import eventImg from "../images/event1.jpg";
import "../styles/calendar.css";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

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
  const [ratings, setRatings] = useState({});
  const [hoverValues, setHoverValues] = useState({});

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const labels = {
    0.5: 'Useless', 1: 'Useless+', 1.5: 'Poor', 2: 'Poor+', 2.5: 'Ok',
    3: 'Ok+', 3.5: 'Good', 4: 'Good+', 4.5: 'Excellent', 5: 'Excellent+',
  };
  const getLabelText = (value) => `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axios.get("http://localhost:3000/api/events", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const events = eventRes.data.data.map(event => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          return {
            ...event,
            dateStr: `${start.getDate()}/${monthNames[start.getMonth()].slice(0,3)}/${start.getFullYear()}`,
            timeStr: `${start.getHours()}:${start.getMinutes().toString().padStart(2,'0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2,'0')}`,
            start,
            color: "#1abc9c",              // restored
    details: event.description, 
            end,
          };
        });
        setTasks(events);

        if(userId) {
          const ticketRes = await axios.get(`http://localhost:3000/api/tickets/user/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setJoinedEventIds(ticketRes.data.data.map(t => t.eventId));

          const recRes = await axios.get("http://localhost:3000/api/recommendations", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userRatings = {};
          recRes.data.data.forEach(r => userRatings[r.eventId] = r.score);
          setRatings(userRatings);
        }

      } catch (err) {
        console.error(err);
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
    if (event.createdBy === userId || joinedEventIds.includes(event.eventId)) return;

    try {
      const res = await axios.post(`http://localhost:3000/api/tickets/user/${userId}`, {
        userId,
        eventId: event.eventId,
        qrCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: "active"
      }, { headers: { Authorization: `Bearer ${accessToken}` }});
      alert(res.data.message || "Ticket created successfully");
      setJoinedEventIds(prev => [...prev, event.eventId]);
    } catch(err) {
      console.error(err);
      alert("Failed to create ticket");
    }
  }

  async function handleRatingChange(eventId, value) {
    setRatings(prev => ({ ...prev, [eventId]: value }));
    try {
      await axios.post("http://localhost:3000/api/recommendations", {
        userId,
        eventId,
        score: value
      }, { headers: { Authorization: `Bearer ${accessToken}` }});
    } catch(err) {
      console.error("Rating submission failed", err);
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
            <div key={d} className={`day ${d === selectedDate ? "active" : ""}`} onClick={() => setSelectedDate(d)}>
              {d}
            </div>
          ))}
        </div>
      </aside>

      <main className="calendar-main">
        <div className="calendar-header">
          <h2>Week of {monthNames[currentMonth]} {selectedDate}, {currentYear}</h2>
          <div className="calendar-options">
            <button className={isTodaySelected ? "active" : ""} onClick={() => setSelectedDate(today.getDate())}>Today</button>
            <select value={selectedOwner} onChange={(e)=>setSelectedOwner(e.target.value)}>
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
              const dayTasks = filteredTasks.filter(t => t.dateStr === dateStr);

              return (
                <div key={dateStr} className="day-column">
                  <div className="day-header">{dayShort}</div>
                  <div className="events">
                    {dayTasks.map((t,i) => (
                      <div key={i} className="event" style={{ backgroundColor: t.color }} onClick={() => setSelectedEvent(t)}>
                        <strong>{t.title}</strong>
                        <p>{t.details}</p>
                        <p>{t.timeStr}</p>
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
                  <span>{selectedEvent.dateStr.split("/")[0]}</span>
                  <span>{selectedEvent.dateStr.split("/")[1]}</span>
                </span>
              </div>
              <div className="details">
                <div className="row">
                  <div className="name">{selectedEvent.title}</div>
                  <div className="time"><i className="fa fa-clock"> {selectedEvent.timeStr}</i></div>
                </div>
                <div className="row"><div className="det">{selectedEvent.details}</div></div>

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

                {/* Show rating */}
                <Box sx={{ width: 200, display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Rating
                    name="event-rating"
                    value={ratings[selectedEvent.eventId] || 0}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(e,newVal)=> {
                      const joined = joinedEventIds.includes(selectedEvent.eventId);
                      const ended = new Date(selectedEvent.end) < today;
                      if(joined && ended) handleRatingChange(selectedEvent.eventId,newVal);
                    }}
                    onChangeActive={(e,newHover)=>setHoverValues(prev=>({...prev,[selectedEvent.eventId]:newHover}))}
                    emptyIcon={<StarIcon style={{opacity:0.55}} fontSize="inherit"/>}
                    readOnly={!(joinedEventIds.includes(selectedEvent.eventId) && new Date(selectedEvent.end) < today)}
                  />
                  <Box sx={{ ml: 2 }}>
                    {labels[hoverValues[selectedEvent.eventId] !== undefined ? hoverValues[selectedEvent.eventId] : ratings[selectedEvent.eventId] || 0]}
                  </Box>
                </Box>

                {/* Show Join button only if event not ended */}
                {new Date(selectedEvent.end) >= today && (
                  <button
                    className={`join-btn ${selectedEvent.owner === userId || joinedEventIds.includes(selectedEvent.eventId) ? "" : "active"}`}
                    onClick={()=>handleJoin(selectedEvent)}
                    style={{ marginTop: "10px" }}
                  >Join</button>
                )}

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
