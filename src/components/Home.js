import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { fetchUserAttributes } from "@aws-amplify/auth";
import Sidebar from "./SideBar"; // ✅ Import Sidebar
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setRole } from '../reducers/userReducer'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        console.log("Fetching user attributes...");
        const attributes = await fetchUserAttributes();
        const role = attributes["custom:role"];
        setUserRole(role);
        dispatch(setRole(role))

        // Redirect users based on role
        // if (role === "Customer") {
        //   navigate("/customer-dashboard");
        // } else if (role === "Counsellor") {
        //   navigate("/counsellor-dashboard");
        // }
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };

    fetchRole();
  }, [navigate]);

  return (
    <Authenticator initialState="signIn">
      {({ user }) => (
        <div style={{ display: "flex" }}>
          <Sidebar /> {/* ✅ Add Sidebar component */}
          <div style={{ marginLeft: "250px", padding: "20px" }}>
            <h2>Welcome, {user?.username}</h2>
            <p>Role: {userRole || "Fetching..."}</p>
            {/* <button onClick={signOut}>Sign out</button> */}
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default Home;
