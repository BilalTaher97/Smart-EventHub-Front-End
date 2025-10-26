import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./Rabab/pages/signup-login";
import Home from "./Rabab/pages/Home";
import Events from "./Rabab/pages/events";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/events" element={<Events />} />
      </Routes>
    </Router>
  );
}