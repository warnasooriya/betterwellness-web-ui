import React ,{ useState, useEffect }from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {Amplify} from 'aws-amplify';
import {awsExports} from "./aws-exports";
import AppRoutes from "./Routes";
import { Authenticator } from "@aws-amplify/ui-react";
import { Provider } from "react-redux"; 
import '@aws-amplify/ui-react/styles.css';
import {Store} from "./store";
import Sidebar from "./components/SideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "bootstrap";
import  useAxiosPrivate from "./hooks/useAxiosPrivate";
import config from "./api/config";
import AppHeader from "./components/AppHeader";
import   './sign-up-custom.css';
import { CFormTextarea } from "@coreui/react";
import { SocketProvider } from "./components/SocketContext";


Amplify.configure({
  ...awsExports,
});


function App() {

  const axios = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [specializations , setSpecializations] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(" ");
  const fetchSpecialization = async () => {
    try {
      setLoading(true);
      const apiUrl = new URL("counsellor/getAllSpecialization", config.baseUrl).href;
      const response = await axios.get(apiUrl);
      const options = response.data.map((item) => {
         return { value: item._id, label: item.Area };
      });
      const newopt = [{ value: "", label: "Please select specialization" }, ...options];
      setSpecializations(newopt);
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.error("Error fetching specialization:", error);
    }
  };

    useEffect(() => {
      fetchSpecialization();
    }, []);

  return (
    <Provider store={Store}>
    <Authenticator.Provider> {/* ✅ Wrap everything inside Authenticator.Provider */}
    <Authenticator initialState='signIn'
    components={{
      SignUp: {
        FormFields() {

          const [selectedUserType, setSelectedUserType] = useState("");

            const handleUserTypeChange = (e) => {
              setSelectedUserType(e.target.value);
            };

          return (
            <>
              <Authenticator.SignUp.FormFields />

               {/* select role */}

              <div><label>Role</label></div>
              <select    className="form-control-custom" name="custom:role" value={selectedUserType} required
                onChange={handleUserTypeChange}   >
                <option value="Customer">Customer</option>
                <option value="Counsellor">Counsellor</option>
              </select>

              {/* select specialization */}
              {selectedUserType === "Counsellor" && (
                <>
              <div><label>Specialization</label></div>
              <select name="custom:specialization"    className="form-control-custom" required>
                {specializations.map((specialization) => (
                  <option key={specialization.value} value={specialization.value}>
                    {specialization.label}
                  </option>
                ))}
              </select>

              <CFormTextarea name="custom:description" rows={5} placeholder="please enter about yourself" className="form-control-custom" required />
              </>
            )}


              <div><label>First name</label></div>
              <input
                type="text"
                name="given_name"
                className="form-control-custom"
                placeholder="Please enter your first name"
              />
              <div><label>Last name</label></div>
              <input
                type="text"
                   className="form-control-custom"
                name="family_name"
                placeholder="Please enter your last name"
              />
              <div><label>Email</label></div>
              <input
                type="text"
                   className="form-control-custom"
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
          <SocketProvider>
        <Sidebar/>
        <AppHeader />
        {/* <div style={{ display: "flex" }}> */}
           <div style={{ marginLeft: "250px", padding: "20px" }}>
           <AppRoutes />
           </div>
         {/* </div> */}
         </SocketProvider>
     </Router>
      )}
    </Authenticator>
    
  </Authenticator.Provider>
  </Provider>
  );
}

export default App;
