import "../styles/home.css";
import aboutImg from "../images/Our Servese.png";
import firstSpeacker from "../images/mic.png";
import user1 from "../images/1.jpg";
import user2 from "../images/2.jpg";
import user3 from "../images/3.jpg";
import user4 from "../images/4.jpg";
import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import axios, { all } from "axios";

export default function Home() {
  const [menuActive, setMenuActive] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [latestEvents, setLatestEvents] = useState([]);
  
  const [editForm, setEditForm] = useState({
    fullName: "",
    passwordHash: "",
    phone: "",
    gender: ""
  });

  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const goToEvents = () => navigate("./events");

  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedEvents, setRecommendedEvents] = useState([]);


const handleShowRecommended = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
    if (!userId || !token) return;

    const recRes = await axios.get(`http://localhost:3000/api/recommendations/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const recommendedIds = recRes.data?.data?.map(r => Number(r.eventId)) || [];

    if (recommendedIds.length === 0) return alert("No recommendations available");

    const eventsRes = await axios.get("http://localhost:3000/api/events", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const allEvents = eventsRes.data?.data || [];

    const recEvents = allEvents.filter(event => recommendedIds.includes(event.eventId));

    setRecommendedEvents(recEvents);
    setShowRecommendation(true);
  } catch (err) {
    console.error("Error fetching recommended events:", err);
    alert("Failed to load recommendations");
  }
};

useEffect(() => {
  const justLoggedIn = localStorage.getItem("justLoggedIn");
  if (justLoggedIn) {
    handleShowRecommended();  // fetch and show recommendations
    localStorage.removeItem("justLoggedIn"); // prevent next automatic open
  }
}, []);


  // Fetch latest events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/events/latest");
        if (res.data && res.data.data) setLatestEvents(res.data.data);
      } catch (err) {
        console.error("Error fetching latest events:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  const handleLinkClick = (name) => {
    setActiveLink(name);
    setMenuActive(false);
  };

  const scrollLeft = () => sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
  const scrollRight = () => sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });

  // Scroll-based active link highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const middleY = window.innerHeight / 2;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= middleY && rect.bottom >= middleY) {
          const id = section.getAttribute("id");
          const headerLinks = document.querySelectorAll("nav ul li a");

          headerLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
              setActiveLink(link.textContent);
            }
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch profile
  useEffect(() => {
    if (!showProfile) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setEditForm({
          fullName: res.data.fullName || "",
          passwordHash: "",
          phone: res.data.phone || "",
          gender: res.data.gender || ""
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [showProfile]);

  // Edit profile submit
  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Login required");

      const res = await axios.put("http://localhost:3000/api/auth/profile", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(res.data.message || "Profile updated");
      setShowEditProfile(false);
      setShowProfile(true);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString();
};


  return (
    <div className="container">
      {/* Header navigation */}
      <nav>
        <div className="nav-center">
          <div className="nav-header">
            <img src={require("../images/logo (2).png")} alt="logo" />
            <span>Events Hub</span>
            <button className="nav-toggle" onClick={() => setMenuActive(prev => !prev)}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <ul className={`links ${menuActive ? "show-links" : ""}`}>
            {["Home", "About", "Events", "Feedback", "Contact Us"].map((item) => {
              const sectionId = item.toLowerCase().replace(" ", "-");
              return (
                <li key={item}>
                  <a
                    href={`#${sectionId}`}
                    className={activeLink === item ? "active" : ""}
                    onClick={() => handleLinkClick(item)}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
            <li className="fa-solid fa-user my-profile" onClick={() => { setShowProfile(true); setShowEditProfile(false); }}></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        {/* Welcome Section */}
        <section className="welcoming" id="home">
          <h4>19 - 25 November, 2025, Amman City</h4>
          <h2>UX Conference 2025</h2>
          <button className="btn" onClick={goToEvents}>See Event</button>
        </section>

        {/* About Section */}
        <section className="about section_gap features_area" id="about">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="main_title">
                  <p className="top_title">We Have Exclusive Stunning Features</p>
                  <h2>About Us</h2>
                  <p>
                    Smart Events Hub makes event management simple. You can create online or in-person events, send invitations, manage attendees, and collect feedback in one place. You handle registration, communication, ticketing, and reports without switching tools. Track results, understand engagement, and improve each event with real data.
                  </p>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="left_features">
                  <img className="img-fluid" src={aboutImg} alt="" />
                </div>
              </div>
              <div className="col-lg-5 offset-lg-1">
                <div className="single_feature">
                  <div className="feature_head">
                    <i className="fa fa-display"></i>
                    <h4>Quick event setup</h4>
                  </div>
                </div>
                <div className="single_feature">
                  <div className="feature_head">
                    <i className="fa fa-display"></i>
                    <h4>Detailed post-event reports</h4>
                  </div>
                </div>
                <div className="single_feature">
                  <div className="feature_head">
                    <i className="fa fa-display"></i>
                    <h4>Mobile-friendly design</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="events" id="events">
          <div className="container">
            <h2 className="title">Our Events</h2>
            {latestEvents.map((event) => (
              <div className="bussinesscard-container" key={event.eventId}>
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div className="bussinesscard">
                    <div className="flip">
                      <div className="front">
                        <div className="top">
                          <div className="logo">
                            {event.title}
                            <div className="event-theme">
                              <em>{event.description}</em>
                            </div>
                          </div>
                        </div>
                        <div className="nametroduction">
                          <div className="name">
                            On {event.startDate}
                            <div><button>Join us</button></div>
                            <img src={firstSpeacker} alt="" />
                          </div>
                        </div>
                        <div className="contact">
                          <div className="desc">
                            <span><i className="fa-solid fa-microphone"></i></span>
                            <span>{event.description}</span>
                          </div>
                          <div className="location" style={{ marginTop: "15px" }}>
                            <span><i className="fa-solid fa-location-dot"></i></span>
                            <span>{event.location}</span>
                          </div>
                          <div className="time" style={{ marginTop: "15px" }}>
                            <span><i className="fa-solid fa-clock"></i></span>
                            <span> {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="back"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="all-events">
              <button onClick={handleShowRecommended}>Recommended</button>
              <button onClick={goToEvents}>see all <i className="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section id="profile" className={`profile ${showProfile ? "show-profile" : ""}`}>
          <div className="container">
            <div className="card p-4">
              <span>
                <i className="fa-solid fa-circle-xmark close" onClick={() => setShowProfile(false)}></i>
              </span>
              <div className="image d-flex flex-column justify-content-center align-items-center">
                <button className="btn btn-secondary">
                  <img src="https://i.imgur.com/wvxPV9S.png" height="100" width="100" />
                </button>
                {user && (
                  <>
                    <span className="name mt-3">{user.fullName}</span>
                    <span className="email">{user.email}</span>
                    <span className="gender">{user.gender}</span>
                    <span className="phone">{user.phone}</span>
                  </>
                )}
                <div className="d-flex flex-row justify-content-center align-items-center mt-3">
                  <span className="number">50
                    <span className="follow">Events Attends</span>
                  </span>
                </div>
                <div className="d-flex mt-2">
                  <button className="btn1 btn-dark" onClick={() => { setShowEditProfile(true); setShowProfile(false); }}>Edit Profile</button>
                </div>
                <button className="logout" onClick={() => { localStorage.removeItem("accessToken"); navigate("/"); }}>Logout</button>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Profile Section */}
        <div className={`edit-profile ${showEditProfile ? "show-edit-profile" : ""}`} id="edit-profile">
          <div className="edit-profile-container">
            <div className="title">
              Edit My Profile
              <span>
                <i className="fa fa-times" onClick={() => { setShowEditProfile(false); setShowProfile(false); }}></i>
              </span>
            </div>
            <form onSubmit={handleEditProfile}>
              <input type="text" placeholder="Full Name" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
              <input type="password" placeholder="New Password" value={editForm.passwordHash} onChange={(e) => setEditForm({ ...editForm, passwordHash: e.target.value })} />
              <input type="text" placeholder="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              <input type="submit" value="Update" />
            </form>
          </div>
        </div>

        {/* Feedback Section */}
        <section className="testimonials" id="feedback">
          <div className="container">
            <span className="tag">What People Say</span>
            <h2>Testimonials</h2>
            <p className="subtitle">Real feedback from our event attendees</p>
            <div className="slider" ref={sliderRef}>
              {[user3, user1, user4, user2].map((img, idx) => (
                <div className="card" key={idx}>
                  <div className="user">
                    <img src={img} alt="user" />
                    <div>
                      <h4>User {idx+1}</h4>
                      <p className="title">Role</p>
                    </div>
                  </div>
                  <p className="text">Sample testimonial text here.</p>
                </div>
              ))}
            </div>
            <div className="slider-controls">
              <button onClick={scrollLeft}>‹</button>
              <button onClick={scrollRight}>›</button>
            </div>
          </div>
        </section>

{/* recommendation events section */}
        {showRecommendation && (
  <div className="recommendation-popup">
    <div className="popup-content">
      <span className="close" onClick={() => setShowRecommendation(false)}>&times;</span>
      <h3>Recommended Events</h3>
      {recommendedEvents.map(event => (
        <div key={event.eventId} className="event-card">
          <h4>{event.title}</h4>
          <p>{event.description}</p>
          <p>{formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}</p>
          <button onClick={() => goToEvents()}>Go To calendar</button>
        </div>
      ))}
    </div>
  </div>
)}

        {/* Footer */}
        <footer id="contact-us">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h4>Keep in touch...</h4>
                <ul>
                  <li><a href="#"><i className="fa-brands fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-linkedin"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-google"></i></a></li>
                </ul>
                <p>&copy; 2025 Smart Events Hub — All rights reserved</p>
              </div>
            </div>
          </div>
          <div className="primary-button">
            <a href="#home"><i className="fa fa-arrow-up"></i></a>
          </div>
        </footer>

      </main>
    </div>
  );
}
