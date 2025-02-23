import React ,{ useState, useEffect }from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {Amplify} from 'aws-amplify';
import {awsExports} from "./aws-exports";
import AppRoutes from "./Routes";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { Provider } from "react-redux"; 
import '@aws-amplify/ui-react/styles.css';
import {Store} from "./store";
import Sidebar from "./components/SideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "bootstrap";
import AppHeader from "./components/AppHeader";
Amplify.configure({
  ...awsExports,
});


function App() {
  return (
    <Provider store={Store}>
    <Authenticator.Provider> {/* ✅ Wrap everything inside Authenticator.Provider */}
    <Authenticator initialState='signIn'
    components={{
      SignUp: {
        FormFields() {

          return (
            <>
              <Authenticator.SignUp.FormFields />

              {/* Custom fields for given_name and family_name */}
              <div><label>First name</label></div>
              <input
                type="text"
                name="given_name"
                placeholder="Please enter your first name"
              />
              <div><label>Last name</label></div>
              <input
                type="text"
                name="family_name"
                placeholder="Please enter your last name"
              />
              <div><label>Email</label></div>
              <input
                type="text"
                name="email"
                placeholder="Please enter a valid email"
              />


            </>
          );
        },
      },
    }}
    services={{
      async validateCustomSignUp(formData) {
        if (!formData.given_name) {
          return {
            given_name: 'First Name is required',
          };
        }
        if (!formData.family_name) {
          return {
            family_name: 'Last Name is required',
          };
        }
        if (!formData.email) {
          return {
            email: 'Email is required',
          };
        }
      },
    }}
    >
      {({ signOut, user}) => (
        <Router>
        <Sidebar/>
        <AppHeader />
        <div style={{ display: "flex" }}>
           <div style={{ marginLeft: "250px", padding: "20px" }}>
           <AppRoutes />
           </div>
         </div>
      
     </Router>
      )}
    </Authenticator>
    
  </Authenticator.Provider>
  </Provider>
  );
}

export default App;
