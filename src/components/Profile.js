import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  fetchUserAttributes,
  updateUserAttributes,
} from "@aws-amplify/auth";
import '../sign-up-custom.css';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import LoadingOverlay from "./LoadingOverlay";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../api/config";
import Swal from "sweetalert2";

function Profile() {

  const [formValues, setFormValues] = useState({
    given_name: '',
    family_name: '',
    email: '',
    'custom:description': '',
    'custom:specialization': '',
    'custom:role': '',
  });
 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [specializations , setSpecializations] = useState([]);
  const [specialization, setSpecialization] = useState('');

  const axios = useAxiosPrivate();
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

 
    

    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        setUser(currentUser);
        setFormValues({
          given_name: attributes.given_name || '',
          family_name: attributes.family_name || '',
          email: attributes.email || '',
          'custom:description': attributes['custom:description'] || '',
          'custom:specialization': attributes['custom:specialization'] || '',
          'custom:role': attributes['custom:role'] || '',
        });
        
        setSpecialization(specializations.find(a=>a.label===attributes['custom:specialization']).value);

        setLoading(false);
      } catch (error) {
        console.error("Failed to load user", error);
        setLoading(false);
      }
    };

  useEffect(() => {
     
    loadUser();
    fetchSpecialization();
 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
  
    if (!user) {
      setMessage("❌ User not loaded. Please refresh and try again.");
      return;
    }
  
    if (!formValues || typeof formValues !== 'object') {
      setMessage("❌ Invalid form data.");
      return;
    }
 
    try {
      setLoading(true);
      const rawAttributes = {
        given_name: formValues.given_name ?? '',
        family_name: formValues.family_name ?? '',
        'custom:description': formValues['custom:description'] ?? '',
        'custom:specialization': formValues['custom:specialization'] ?? '',
        'custom:role': formValues['custom:role'] ?? '',
      };
  
      const cleanAttributes = Object.fromEntries(
        Object.entries(rawAttributes).filter(([_, value]) => value !== null && value !== undefined)
      );
     
      await updateUserAttributes({
        user,
        userAttributes: cleanAttributes,
      });
      setMessage('✅ Profile updated successfully!');
      setLoading(false);
       Swal.fire("Updated!", "Profile updated successfully!", "success");
    } catch (error) {
      console.error("❌ Error updating profile", error);
      setMessage('❌ Failed to update profile');
    }
  };
  
  

  if (loading) return <div>Loading...</div>;

  return (
    <CCard>
    <CCardHeader>Update Profile</CCardHeader>
    <LoadingOverlay isLoading={loading} />
    <CCardBody>
     
    
        
      {message && <div><strong>{message}</strong></div>}
      <form onSubmit={handleUpdate}>
      <CRow>
        <CCol md={6}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="given_name"
            value={formValues.given_name}
            onChange={handleChange}
            className="form-control-custom"
            required
          />
        </div>
        </CCol>
        <CCol md={6}>
        <div className="form-group">
          <label>Last Name</label>
          <input
            name="family_name"
            value={formValues.family_name}
            onChange={handleChange}
            className="form-control-custom"
            required
          />
        </div>
          </CCol>
        </CRow>
        <CRow>
        <CCol md={6}>

        <div className="form-group">
          <label>Email </label>
          <input
            name="email"
            value={formValues.email}
            className="form-control-custom"
            disabled
          />
        </div>
        </CCol>
        <CCol md={6}>
        <div className="form-group">
          <label>Role</label>
          <select
            name="custom:role"
            value={formValues['custom:role']}
            onChange={handleChange}
            className="form-control-custom"
            required
          >
            <option value="Customer">Customer</option>
            <option value="Counsellor">Counsellor</option>
          </select>
        </div>
          </CCol>
        </CRow>
       
        

        {formValues['custom:role'] === "Counsellor" && (
          <>
           <CRow>
        <CCol md={6}>

        <select name="custom:specialization" value={formValues['custom:specialization']} onChange={handleChange}    className="form-control-custom" required>
                {specializations.map((specialization) => (
                  <option key={specialization.value} value={specialization.label}>
                    {specialization.label}
                  </option>
                ))}
              </select>

        {/* <div className="form-group">
              <label>Specialization</label>
              <input
                name="custom:specialization"
                value={formValues['custom:specialization']}
                onChange={handleChange}
                className="form-control-custom"
              />
            </div> */}
          </CCol>
          <CCol md={6}>
          <div className="form-group">
              <label>Description</label>
              <textarea
                name="custom:description"
                value={formValues['custom:description']}
                onChange={handleChange}
                className="form-control-custom"
                rows="4"
              />
            </div>
          </CCol>
        </CRow>
            

           
          </>
        )}

        <button type="submit" className="btn btn-primary mt-3">
          Update Profile
        </button>
      </form>
    
        
        </CCardBody>
        </CCard>
    
  );
}

export default Profile;
