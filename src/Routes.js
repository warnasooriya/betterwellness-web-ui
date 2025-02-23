import React from "react";
import { Routes, Route } from "react-router-dom";
import AvailabilitySetup from "./components/AvailabilitySetup";
import Calendar from "./components/Calendar";
import Home from "./components/Home";
import ProtectedRoute from "./auth/ProtectedRoute";
import Booking from "./components/Booking";
import BookingInquiries from "./components/BookingInquiries";
 



const AppRoutes = () => {
 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
       
            <Route element={<ProtectedRoute component={Booking} allowedRoles={['Customer']} />}>
              <Route path="/booking" name="Booking" element={<Booking />} />
            </Route>

            <Route element={<ProtectedRoute component={BookingInquiries} allowedRoles={['Customer']} />}>
              <Route path="/booking-inquiries" name="Booking Inquiries" element={<BookingInquiries />} />
            </Route>

            <Route element={<ProtectedRoute component={AvailabilitySetup} allowedRoles={['Counsellor']} />}>
              <Route path="/setup-awailability" name="Availability Setup" element={<AvailabilitySetup />} />
            </Route>

            <Route element={<ProtectedRoute component={Calendar} allowedRoles={['Counsellor']} />}>
              <Route path="/booking-calender" name="Availability Setup" element={<Calendar />} />
            </Route>

    
      <Route path="*" element={<h2>404 - Not Found</h2>} />
    </Routes>
  );
};

export default AppRoutes;
