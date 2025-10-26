import "../styles/home.css";
import aboutImg from "../images/Our Servese.png";
import firstSpeacker from "../images/mic.png";
import user1 from "../images/1.jpg";
import user2 from "../images/2.jpg";
import user3 from "../images/3.jpg";
import user4 from "../images/4.jpg";
import { useNavigate } from "react-router-dom";
// import secondSpeacker from "../images/speaker2.png";
import React, {  useRef,useEffect, useState } from "react";

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

  const goToEvents = () => {
    navigate("./events");
  };
  
  useEffect(() => {
  fetch("http://localhost:3000/api/events/latest")
    .then(res => res.json())
    .then(data => {
      if (data && data.data) setLatestEvents(data.data);
    })
    .catch(err => console.error("Error fetching latest events:", err));
}, []);

  // to know the page that you where in
  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  // set active for nav links
  const handleLinkClick = (name) => {
    setActiveLink(name);
    setMenuActive(false);
  };

  // handle the feedback slider
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
  };


  // scroll-based active link highlight
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
            const href = link.getAttribute("href");

            if (href === `#${id}`) {
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

  useEffect(() => {
  if (showProfile) {
    const token = localStorage.getItem("accessToken");
    // if (!token) return navigate("/");

    fetch("http://localhost:3000/api/auth/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setEditForm({
          fullName: data.fullName || "",
          passwordHash: "",
          phone: data.phone || "",
          gender: data.gender || ""
        });
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load profile");
      });
  }
}, [showProfile]);


  return (
    <div className="container">
      {/* header navs */}
      <nav>
        <div className="nav-center">
          <div className="nav-header">
            <img src={require("../images/logo (2).png")} alt="logo" />
            <span>Events Hub</span>
            <button
              className="nav-toggle"
              onClick={() => setMenuActive((prev) => !prev)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

         <ul className={`links ${menuActive ? "show-links" : ""}`}>
            {["Home", "About", "Events", "Feedback" ,"Contact Us"].map((item) => {
             const sectionId = item.toLowerCase().replace(" ", "-"); // home, about, events, feedback ,contact-us
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
          <li className="fa-solid fa-user my-profile"
           onClick={() => {
            setShowProfile(true);
            setShowEditProfile(false);
          }
           } // show when clicked
           ></li>
          </ul>
        </div>
      </nav>

      {/* content start */}
      <main className="content">
        {/* welcoming section */}
        <section className="welcoming" id="home">
          <h4>19 - 25 November, 2025, Amman City</h4>
          <h2>UX Conference 2025</h2>
          <button className="btn"
           onClick={()=>{
            goToEvents();
           }} >See Event</button>
        </section>

        {/* about section */}
        <section className="about section_gap features_area" id="about">
		    <div className="container">
		     	<div className="row justify-content-center">
			    	<div className="col-lg-8 text-center">
			   		  <div className="main_title">
				  		<p className="top_title">We Have Exclusive Stunning Features</p>
					  	<h2>About Us</h2>
						<p>
                Smart Events Hub makes event management simple.
                You can create online or in-person events, send invitations, manage attendees, and collect feedback in one place.
                You handle registration, communication, ticketing, and reports without switching tools.
                Track results, understand engagement, and improve each event with real data.</p>
					</div>
				</div>
			</div>
			<div className="row align-items-center">
				<div className="col-lg-6">
					<div className="left_features">
						<img className="img-fluid" src={aboutImg} alt=""/>
					</div>
				</div>
				<div className="col-lg-5 offset-lg-1">
					 {/* single features  */}
					<div className="single_feature">
						<div className="feature_head">
							<i className="fa fa-display"></i>
							<h4>Quick event setup</h4>
						</div>
					</div>
					{/* single features  */}
					<div className="single_feature">
						<div className="feature_head">
							<i className="fa fa-display"></i>
							<h4>Detailed post-event reports</h4>
						</div>
					</div>
					{/* single features  */}
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

  {/* events section */}
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
                    Created By {event.createdBy}
                    <div>
                      <button>Join us</button>
                    </div>
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
                    <span>{event.startDate} - {event.endDate}</span>
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
      <button onClick={() => goToEvents()}>
        see all <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
</section>


{/* profile section */}
<section id="profile" className={`profile ${showProfile ? "show-profile" : ""}`}>
  <div className="container">
     <div className="card p-4">
      <span>
        <i className="fa-solid fa-circle-xmark close" onClick={() => setShowProfile(false)}></i>
      </span>
      <div className=" image d-flex flex-column justify-content-center align-items-center">
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
      
      <div className=" d-flex mt-2">
        <button className="btn1 btn-dark"
         onClick={() => {
                      setShowEditProfile(true);
                      setShowProfile(false);
                    }}>Edit Profile</button>
      </div>

      <button
  className="logout"
  onClick={() => {
    localStorage.removeItem("accessToken");
    navigate("/");
  }}
>
  Logout
</button>
  </div>
</div>
</div>
</section>

      {/* edit section */}
<div className={`edit-profile ${showEditProfile ? "show-edit-profile" : ""}`} id="edit-profile">
  <div className="edit-profile-container">
    <div className="title">
      Edit My Profile
      <span>
        <i
          className="fa fa-times"
          onClick={() => {
            setShowEditProfile(false);
            setShowProfile(false);
          }}
        ></i>
      </span>
    </div>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) return alert("Login required");

        fetch("http://localhost:3000/api/auth/update", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        })
          .then((res) => res.json())
          .then((data) => {
            alert(data.message || "Profile updated");
            setShowEditProfile(false);
            setShowProfile(true);
          })
          .catch((err) => {
            console.error(err);
            alert("Update failed");
          });
      }}
    >
      <input
        type="text"
        id="fullName"
        name="fullName"
        placeholder="Full Name"
        value={editForm.fullName}
        onChange={(e) =>
          setEditForm({ ...editForm, fullName: e.target.value })
        }
      />

      <input
        type="password"
        id="passwordHash"
        name="passwordHash"
        placeholder="New Password"
        value={editForm.passwordHash}
        onChange={(e) =>
          setEditForm({ ...editForm, passwordHash: e.target.value })
        }
      />

      <input
        type="text"
        id="phone"
        name="phone"
        placeholder="Phone"
        value={editForm.phone}
        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
      />

      <input type="submit" value="Update" />
    </form>
  </div>
</div>


      {/* feedback section */}
         <section className="testimonials" id="feedback">
      <div className="container">
        <span className="tag">What People Say</span>
        <h2>Testimonials</h2>
        <p className="subtitle">Real feedback from our event attendees</p>

        <div className="slider" ref={sliderRef}>
          <div className="card active">
            <div className="user">
              <img src={user3} alt="user" />
              <div>
                <h4>Sarah Ali</h4>
                <p className="title">Speaker</p>
              </div>
            </div>
            <p className="text">
              The event was organized with precision and energy.
            </p>
          </div>

          <div className="card">
            <div className="user">
              <img src={user1} alt="user" />
              <div>
                <h4>Omar Hussein</h4>
                <p className="title">Attendee</p>
              </div>
            </div>
            <p className="text">
              I made valuable connections and gained practical knowledge.
            </p>
          </div>

          <div className="card">
            <div className="user">
              <img src={user4} alt="user" />
              <div>
                <h4>Lina Saeed</h4>
                <p className="title">Panelist</p>
              </div>
            </div>
            <p className="text">
              The sessions were engaging and insightful from start to finish.
            </p>
          </div>

          <div className="card">
            <div className="user">
              <img src={user2} alt="user" />
              <div>
                <h4>Ahmed Khalil</h4>
                <p className="title">Organizer</p>
              </div>
            </div>
            <p className="text">
              Great teamwork and smooth coordination made the event a success.
            </p>
          </div>
        </div>

        <div className="slider-controls">
          <button onClick={scrollLeft}>‹</button>
          <button onClick={scrollRight}>›</button>
        </div>
      </div>
    </section>

{/* footer */}
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
