import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./Rabab/pages/signup-login";
import Home from "./Rabab/pages/Home";
import AdminDashboard from "./Monther/pages/AdminDashboard";
import EventDetailPage from "./Monther/pages/EventDetailPage";
import { EventsProvider } from "./Monther/contexts/EventsContext";
import { AdminProvider } from "./Monther/contexts/AdminContext";

export default function App() {
  return (
    <EventsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route 
            path="/admin/events/:id" 
            element={
              <AdminProvider>
                <EventDetailPage />
              </AdminProvider>
            } 
          />
        </Routes>
      </Router>
    </EventsProvider>
  );
}
