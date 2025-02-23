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



Amplify.configure({
  ...awsExports,
});


function App() {
 

  return (
    <Provider store={Store}>
    <Authenticator.Provider> {/* ✅ Wrap everything inside Authenticator.Provider */}
    <Router>
      <AppRoutes />
    </Router>
  </Authenticator.Provider>
  </Provider>
  );
}

export default App;
