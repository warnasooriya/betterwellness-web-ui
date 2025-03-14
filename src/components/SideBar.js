import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // ✅ Add CSS for styling
import {  useSelector } from 'react-redux'
const Sidebar = () => {
    // const { signOut } = useAuthenticator();
    const role = useSelector((state) => state.userReducer.role) // ✅ Get user role from Redux store
    const messageCount = useSelector((state) => state.messageReducer.unreadCount) // ✅ Get unread message count from Redux store
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        
        {/* Customer Role */}
        {role === "Customer" && (
          <>
            <li>
              <Link to="/booking">Booking</Link>
            </li>
           
          </>
        )}

        {/* Counsellor Role */}
        {role === "Counsellor" && (
          <>
            <li>
              <Link to="/setup-awailability">Availability Setup</Link>
            </li>
            
          </>
        )}
 <li>
              <Link to="/messages">Messages  {messageCount>0 && (<span className="message-count">{messageCount}</span>)}</Link>
            </li>
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
