import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "./components/CustomerDashboard";
import CounsellorDashboard from "./components/CounsellorDashboard";
import Home from "./components/Home";
import ProtectedRoute from "./auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Protected Routes Based on Roles */}
      <Route
        path="/customer-dashboard"
        element={<ProtectedRoute component={CustomerDashboard} allowedRoles={["Customer"]} />}
      />
      <Route
        path="/counsellor-dashboard"
        element={<ProtectedRoute component={CounsellorDashboard} allowedRoles={["Counsellor"]} />}
      />

      <Route path="*" element={<h2>404 - Not Found</h2>} />
    </Routes>
  );
};

export default AppRoutes;
