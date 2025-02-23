import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "./components/CustomerDashboard";
import CounsellorDashboard from "./components/CounsellorDashboard";
import Home from "./components/Home";
import ProtectedRoute from "./auth/ProtectedRoute";
import Booking from "./components/Booking";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/booking" element={<Booking/>} />
      <Route path="*" element={<h2>404 - Not Found</h2>} />
    </Routes>
  );
};

export default AppRoutes;
