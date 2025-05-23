import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CRow, CCol, CFormLabel, CFormInput } from "@coreui/react"; // Corrected imports
import { useDispatch, useSelector } from 'react-redux'
import './Availability.css'
import { setAvailability, setAllAvailabilities } from '../reducers/availabilityReducer'
import  useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../api/config";
import LoadingOverlay from "./LoadingOverlay";
import Swal from "sweetalert2";
 
 

const localizer = momentLocalizer(moment);

export default function BookingHistory() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnselectEventModalOpen,setIsOnselectEventModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [view, setView] = useState("month");
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent,setSelectedEvent] = useState({})
  const axios = useAxiosPrivate();

 

  // Function to handle slot selection and open the modal
  const handleSelectSlot = useCallback(({ start, end }) => {
    const stDate = moment(start).startOf("day").toDate();
    const today = moment().startOf("day").toDate();

    console.log("Normalized Dates:", stDate, today);
 
    if(stDate < today) {
      return;
    }
    // Only set selected range if the slot selection has changed
    if (selectedRange.start !== start || selectedRange.end !== end) {
      setSelectedRange({ start, end });
      setIsModalOpen(true); // Open the modal when a slot is selected
    }
  }, [selectedRange]);


  const availabilies = useSelector(state => state.availabilityReducer.availability)
  const dispatch = useDispatch()


  const setEvents = (e) => {
    debugger;
    dispatch(setAvailability(e));
  }

  const setAllEvents = (e) => {
    dispatch(setAllAvailabilities(e));
  }

  // Function to handle date range changes in the modal
  const handleDateRangeChange = useCallback((newStart, newEnd) => {
    setSelectedRange({ start: newStart, end: newEnd });
  }, []);

  // Function to handle event creation after setting availability
  const handleSave = useCallback(() => {
    const { start, end } = selectedRange;
    if (start && end) {
      setLoading(true); // Set loading state to true
      
      const title = `Available`;

      if (title) {
        axios.post(`${config.baseUrl}/counsellor/availability`, { title, start, end , user: localStorage.getItem('userId') })
        .then((response) => {
          console.log("Event created:", response.data);
          setEvents(response.data);
          setLoading(false); // Set loading state to false
        })
        .catch((error) => {
          console.error("Error creating event:", error);
          setLoading(false); // Set loading state to false
        })
        .finally(() => {
          setLoading(false); // Set loading state to false
        });
      }
    
    }
    setIsModalOpen(false); // Close the modal after saving
  }, [selectedRange]);


  const handleOnSelectEvent = (event) => {
    
    setIsOnselectEventModalOpen(true);
    setSelectedEvent(event);
    console.log(event);
    
  };

  // Function to handle view change in the calendar
  const handleViewChange = useCallback((view) => {
    console.log("View changed to:", view);
    setView(view); // Directly set the view state
  }, []);

  const getTitle = (event) => {
    return event.counselor.family_name + " " + event.counselor.given_name  + " : " + event.specialization.Area + " - " + event.status;
    
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}/booking/getBookings/${localStorage.getItem('userId')}`);
      console.log("Events fetched:", response.data);
      const eventLists = await response.data.map(event => ({
        title: getTitle(event),
        start:  event.availability.start, // Ensure start is a Date object
        end: event.availability.end,     // Ensure end is a Date object
        id: event._id,
        counselor: event.counselor.family_name + " " + event.counselor.given_name,
        specality: event.specialization.Area,
        status: event.status,
        description: event.counselor.description,
        email: event.counselor.email
      }));
 
      setAllEvents(eventLists);
    } catch (error) {
      setAllEvents([]);
      console.error("Error fetching events:", error);
    }
  };

  
  useEffect(() => {
    fetchAvailability();  
  }, []); 

  // Function to handle date navigation in the calendar
  const handleNavigate = useCallback((date) => {
    setCurrentDate(date); // Set the selected range to the date
  }, []);


  const getEventClass = (event) => {
    debugger
    if(event.status==='Cancel') {
      return "custom-cancel-class";
    }

    if(event.status==='Complete') {
      return "custom-complete-class";
    }

    if (event.booked) {
      return "custom-booked-class";
    }
    

    return "";
  }

  return (
    <div>
      <h2>📅 Booking Calendar</h2>
      <LoadingOverlay isLoading={loading} />
      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={availabilies.map(event => ({
          ...event,
          start: new Date(event.start), // Ensure start is a Date object
          end: new Date(event.end),     // Ensure end is a Date object
        }))}
        startAccessor="start"
        endAccessor="end"
        selectable
        date={currentDate} 
        view={view}
        onSelectSlot={handleSelectSlot} // Open the modal when selecting a slot
        onView={handleViewChange} // Handle view change
        onSelectEvent={(event) => handleOnSelectEvent(event)} // Handle event selection
        style={{ height: 600 }} // Example height for the calendar
        views={["month", "week", "day", "agenda"]}
        min={moment().startOf("day").toDate()} // Minimum date selection (based on selected range)
        max={moment().endOf("day").toDate()} // Maximum date selection (based on selected range)
        timeslots={1}  // This defines that each slot is 1 hour in "day" and "week" views
        step={30}      // This defines that each slot interval is 30 minutes
        onNavigate={(date) => handleNavigate(date)} // Handle date navigation
        eventPropGetter={(event) => (
          {
          className: getEventClass(event),
          style: {
            backgroundColor: "#3788d8",
            color: "white",
            fontSize: "14px",
            padding: "5px"
          },
        })
      
      }
        
      />
      

      <CModal
              visible={isOnselectEventModalOpen}
              onClose={() => setIsOnselectEventModalOpen(false)} // Close the modal when clicked on overlay or cancel
              size="lg"
            >
              <CModalHeader>
                <h5>Session Details</h5>
              </CModalHeader>
              <CModalBody>
              <CRow>
                  <CCol md={6} >
                  <CFormLabel>Session Date: </CFormLabel>
                    <CFormInput
                                    type="datetime-local"
                                    value={moment(selectedEvent.start).format("YYYY-MM-DD HH:mm")}
                                    onChange={(e) => handleDateRangeChange(new Date(e.target.value), selectedRange.end)}
                                    className="form-control" disabled // Bootstrap class for styling
                                  />
                  </CCol>
                  <CCol md={6} >

                    <CFormLabel>Session Status:  </CFormLabel>
                    <CFormInput type="text" disabled value={selectedEvent.status} />
 
                  </CCol>
                  </CRow>
                  <p></p>
                 <CRow>
                  <CCol md={6} >
                    <CFormLabel>Counselor:  </CFormLabel>
                    <CFormInput type="text" disabled value={selectedEvent.counselor} />
                  </CCol>
                  <CCol md={6} >

                    <CFormLabel>Specialization:  </CFormLabel>
                    <CFormInput type="text" disabled value={selectedEvent.specality} />
                  </CCol>
                  </CRow>
                  <p></p>
                  
                  <CRow>
                  <CCol md={12} >
                    <CFormLabel>Counselor Description:  </CFormLabel>
                    <CFormInput type="text" disabled value={selectedEvent.description} />
                  </CCol>
                  </CRow>
                  <CRow>
                  <CCol md={6} >
                    <CFormLabel>Counselor Email:  </CFormLabel>
                    <CFormInput type="text" disabled value={selectedEvent.email} />
                  </CCol>
                   
                  </CRow>
                  <p></p>
              </CModalBody>
              
            </CModal>

       
    </div>
  );
}
 
