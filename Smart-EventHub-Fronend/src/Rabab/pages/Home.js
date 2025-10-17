import "../styles/home.css";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [menuActive, setMenuActive] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  const handleLinkClick = (name) => {
    setActiveLink(name);
    setMenuActive(false);
  };

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
            {["Home", "About", "Events", "Contact Us"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className={activeLink === item ? "active" : ""}
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* content start */}
      <main className="content">
        <section className="welcoming">
          <h4>19 - 25 November, 2025, Amman City</h4>
          <h2>UX Conference 2025</h2>
          <button className="btn">See Event</button>
        </section>
      </main>
    </div>
  );
}
