import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CRow,
} from "@coreui/react";
import { FaCalendar, FaSearch } from "react-icons/fa";
import config from "../api/config";
import Select from "react-select";
import './Booking.css'
import { setSpecializations } from '../reducers/specializationReducer'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment";
import Swal from "sweetalert2";
import LoadingOverlay from "./LoadingOverlay";

export default function CounsellorList() {
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
  const axios = useAxiosPrivate();
  const [counsellors, setCounsellors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCounsellors, setFilteredCounsellors] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [specializations, setSpecializations] = useState([]);

    const dispatch = useDispatch()
    const specializationReducer = useSelector(state => state.specializationReducer.specializations)

  // Fetch counsellor data

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      console.log("Fetching counsellors...");
      const apiUrl = new URL(
        `api/booking/list?search=${search}`,
        config.bookingServiceBaseUrl
      ).href;
      const response = await axios.get(apiUrl); // API call
      setCounsellors(response.data);
      setFilteredCounsellors(response.data);
        setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching counsellors:", error);
    }
  };

    // Fetch specializations
    const fetchSpecializations = async () => {
      try {
        
        setLoading(true);
        console.log("Fetching specializations...");
        const apiUrl = new URL(
          `api/specialization`,
          config.counsellorServiceBaseUrl
        ).href;
        const response = await axios.get(apiUrl); // API call
        const options = response.data.map((item) => {
           return { value: item._id, label: item.Area };
        });
        const newopt = [{ value: "", label: "Please select specialization" }, ...options];
        setSpecializations(newopt);
        dispatch(setSpecializations(newopt));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching specializations:", error);
      }
    };

  useEffect(() => {
    fetchCounsellors();
    fetchSpecializations();
  }, []);

  // Handle search and filter
  useEffect(() => {
    const filtered = counsellors.filter(
      (c) =>
        c.specialization.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCounsellors(filtered);
  }, [search, counsellors]);


    // Handle filter by specialization
    const handleFilter = () => {
        fetchCounsellors();
    };

    const formatSlotStart = (slot) => {
        const start = moment(slot.start).toDate().toLocaleDateString();
        return start;
    };

    const formatSlot = (slot) => {
    const start = moment(slot.start).toDate().toLocaleDateString();
    // format the date and time
    const stTime = moment(slot.start).toDate().toLocaleTimeString();
    const end = moment(slot.end).toDate().toLocaleTimeString();
    return `${stTime} - ${end}`;
    };


    const handleBook = async (slot) => {

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to book this slot?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, book it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Perform the delete action
              try {
                setLoading(true);
                console.log("Booking slot:", slot);
                const apiUrl = new URL(
                    `api/booking`,
                    config.bookingServiceBaseUrl
                ).href;
                const response = await axios.post(apiUrl, {...slot , user: localStorage.getItem('userId')}); // API call
                console.log("Booking response:", response.data);
                fetchCounsellors();
                Swal.fire("Booked!", "Your slot has been booked.", "success");

            } catch (error) {
                setLoading(false);
                console.error("Error booking slot:", error);
            }
            }
          });

        
    };
     
  return (
    <CCard>
      <CCardHeader>Counsellor Booking</CCardHeader>
      <LoadingOverlay isLoading={loading} />
      <CCardBody>
        {/* Search */}
        <CRow>
          <CCol md={2}>
            <label className="form-label">Date:</label>
            <CFormInput type="date" placeholder="Search by date..."    onChange={setDate} />
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="Specialization">Specialization</CFormLabel>
            <Select
              name="Specialization"
              options={specializations}
              onChange={setSpecialization}
              value={specialization}
            />
          </CCol>

          <CCol md={5}>
          <CFormLabel htmlFor="Search">Search : </CFormLabel>
            <CFormInput
              type="text"
              name="Search"
              placeholder="Search by name or specialization..."
              // className="w-full p-2 border rounded mb-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CCol>

          <CCol md={1}>
            <br></br>
            
            <CButton color="info" onClick={handleFilter}>
              <FaSearch />
            </CButton>
          </CCol>
        </CRow>

        {/* Counsellor List */}
        <p></p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCounsellors.map((counsellor) => (
            <CCard
              key={counsellor.id}
              
            >
              <CCardHeader>
                <h6 className="text-lg font-semibold">{counsellor.firstName}  {counsellor.lastName}  - {counsellor.specialization}</h6>
              </CCardHeader>
              <CCardBody>
                <p className="text-gray-600">{counsellor.specialization}</p>
                <p className="text-sm text-gray-500">
                  {counsellor.description}  
                </p>
               
                        <CRow>
                        {counsellor.availabilities.map((slot) => (
                            <CCol md={3}>
                                <CCard className="mb-3">
                                    <CCardBody>
                                        <CFormLabel> <FaCalendar className="form-icon" /> {formatSlotStart(slot)}</CFormLabel>
                            <CInputGroup>
                               {/* <FaCalendar className="form-icon"/> */}
                               <CFormInput type="text" disabled value={formatSlot(slot)} />
                               {/* <CFormCheck
                                   className="form-check-input"
                                   type="checkbox"
                                   id="flexCheckDefault"
                                    
                               /> */}
                               <CButton color="info" onClick={() => handleBook(slot)} >Book this slot</CButton>
                               </CInputGroup>
                                        
                                    </CCardBody>
                                </CCard>
                               
                       </CCol>
                                
                            ))}
                             </CRow>
                        
                  
              </CCardBody>
            </CCard>
          ))}
        </div>

        {/* No Results Found */}
        {filteredCounsellors.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No counsellors found.
          </p>
        )}
      </CCardBody>
    </CCard>
  );
}
