import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./Rabab/pages/signup-login";
import Home from "./Rabab/pages/Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
