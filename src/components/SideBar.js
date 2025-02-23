import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // ✅ Add CSS for styling
import {  useSelector } from 'react-redux'
const Sidebar = () => {
    // const { signOut } = useAuthenticator();
    const role = useSelector((state) => state.userReducer.role) // ✅ Get user role from Redux store
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        {/* Common Links for All Users */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Customer Role */}
        {role === "Customer" && (
          <>
            <li>
              <Link to="/booking">Booking</Link>
            </li>
            <li>
              <Link to="/booking-inquiries">Booking Inquiries</Link>
            </li>
          </>
        )}

        {/* Counsellor Role */}
        {role === "Counsellor" && (
          <>
            <li>
              <Link to="/counsellor-dashboard">Availability Setup</Link>
            </li>
            <li>
              <Link to="/counsellor-reports">Booking Calender</Link>
            </li>
          </>
        )}

        <li>
        {/* <button onClick={()=>signOut} className="logout-button">
            Sign Out
          </button> */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
