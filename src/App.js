import React  ,{ useEffect, useState }from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { awsExports} from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import { Provider } from "react-redux";
import { Store } from "./store";
import RequireAuth from "./components/RequireAuth";
import DefaultLayout from "./layout/DefaultLayout";
import "@aws-amplify/ui-react/styles.css";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { useDispatch, useSelector } from 'react-redux'
import { setRole } from './reducers/userReducer'
Amplify.configure({
  ...awsExports,
});

function App() {
 
  return (
    <Provider store={Store}>
      <Authenticator.Provider initialState="signIn">
       {({ user }) => (
        <HashRouter> {/* ✅ Ensure all routes are inside a Router */}
          <Routes> {/* ✅ Wrap all <Route> inside <Routes> */}
            <Route element={<RequireAuth allowedRoles={["Customer", "Counsellor"]} />}>
              <Route path="*" element={<DefaultLayout />} />
            </Route>
            <Route path="unauthorized" element={<h1>Unauthorized</h1>} />
          </Routes>
        </HashRouter>
        )}
      </Authenticator.Provider>
    </Provider>
  );
}

export default App;
