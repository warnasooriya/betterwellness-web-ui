import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown, NavDropdown } from "react-bootstrap";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { FaUserCircle } from "react-icons/fa";
import "./AppHeader.css";

const AppHeader = () => {
  const { signOut, user } = useAuthenticator(); // Get user and signOut function

  return (
    <Navbar className="app-header"  bg="dark" variant="dark" expand="lg">
      {/* <Container> */}
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/">BetterWellness</Navbar.Brand>

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
                <NavDropdown.Item onClick={signOut}>Sign Out</NavDropdown.Item>
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
