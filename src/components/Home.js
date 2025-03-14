import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { fetchUserAttributes ,getCurrentUser } from "@aws-amplify/auth";
import Sidebar from "./SideBar"; // ✅ Import Sidebar
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setRole } from '../reducers/userReducer'
import CounsellorList from "./CounsellorList";
import AvailabilitySetup from "./AvailabilitySetup";

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [cuser, setCUser] = useState(null);
  
  useEffect(() => {
  
    
    const fetchRole = async () => {
      try {
        console.log("Fetching user attributes...");
        const attributes = await fetchUserAttributes();
        const role = attributes["custom:role"];
        setUserRole(role);
        dispatch(setRole(role))
 
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };

    const fetchUser = async () => {
      try {
        console.log("Fetching current user...");
        const currentUser = await getCurrentUser();
        console.log("Current user:", currentUser);
        setCUser(currentUser);
        dispatch(setUser({username:currentUser.username,id:currentUser.id}))
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
    fetchRole();
  }, []);

  return (
      <>
      {userRole==="Customer" ?  <CounsellorList /> : <AvailabilitySetup />}
      </>
    
  );
};

export default Home;
