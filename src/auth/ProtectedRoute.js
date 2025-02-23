import React from "react";
import { Navigate } from "react-router-dom";
import {  useSelector } from 'react-redux'

const ProtectedRoute =  ({ component: Component, allowedRoles }) => {
    const userRole = useSelector((state) => state.userReducer.role)
  return allowedRoles.includes(userRole) ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
