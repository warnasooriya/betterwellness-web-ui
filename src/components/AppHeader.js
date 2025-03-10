import React ,{useEffect} from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown, NavDropdown } from "react-bootstrap";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { FaUserCircle } from "react-icons/fa";
import { setUser, setRole } from '../reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserAttributes ,fetchAuthSession , } from "@aws-amplify/auth";
import  useAxiosPrivate from "../hooks/useAxiosPrivate";
import logo from "../assets/logo.webp";
import "./AppHeader.css";
import config from "../api/config";
import LoadingOverlay from "./LoadingOverlay";

const AppHeader = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch()
  const axios = useAxiosPrivate();
  const { signOut, user } = useAuthenticator(); // Get user and signOut function

  const signOutCall = () => {
    console.log("Signing out...");
    dispatch(setRole(null));
    dispatch(setUser({}));
    localStorage.clear();
    signOut();
  }

    
    const syncUser = async (user) => {
      try {
        setLoading(true);
        const attributes = await fetchUserAttributes();
        const role = attributes["custom:role"];
        const specialization = attributes["custom:specialization"];
        const description = attributes["custom:description"];
        console.log("User role:", role);
        const userName = user?.tokens?.signInDetails?.loginId;
        const apiUrl = new URL("api/user", config.userServiceBaseUrl).href;
        const response = await axios.post(apiUrl, { role , attributes,userName , specialization , description });
        console.log("User sync response:", response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching user attributes:", error);
      }
    };
  
    const fetchUserTokens = async () => {
      try {
       
        const user = await fetchAuthSession();
        const accessToken = user.tokens.accessToken.toString();
        const idToken = user.tokens.idToken.toString();
        // Store tokens locally (you can choose sessionStorage or localStorage)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user?.userSub);
        console.log("User tokens retrieved:", { accessToken,  idToken });
        syncUser(user);
       
      } catch (error) {
        console.error("Error fetching user tokens:");
      }
    };
  
     // Get the user and tokens on component mount
     useEffect(() => {
      fetchUserTokens();
    }, []);

  return (
  
    <Navbar className="app-header"  bg="dark" variant="dark" >
        <LoadingOverlay isLoading={loading} />
      {/* <Container> */}
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/">
        <img 
          src={logo} 
          alt="BetterWellness Logo" 
          className="logo"
        />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Left-side navigation links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          </Nav>

          {/* Right-side Profile & Auth controls */}
          <Nav className="ms-auto">
            {user ? (
              <NavDropdown 
                title={<FaUserCircle size={24} color="white" />} 
                align="end"
                id="profile-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signOutCall}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      {/* </Container> */}
    </Navbar>
  );
};

export default AppHeader;
