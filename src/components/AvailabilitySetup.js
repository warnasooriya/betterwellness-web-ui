import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CRow, CCol } from "@coreui/react"; // Corrected imports
import { useDispatch, useSelector } from 'react-redux'
import './Availability.css'
import { setAvailability, setAllAvailabilities } from '../reducers/availabilityReducer'
import  useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../api/config";
import LoadingOverlay from "./LoadingOverlay";
import Swal from "sweetalert2";
 

const localizer = momentLocalizer(moment);

export default function AvailabilitySetup() {
  
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
    debugger
    if(event.status==="Complete" || event.status==="Cancel"){
      return
    }
    setIsOnselectEventModalOpen(true);
    setSelectedEvent(event);
    
  };

  // Function to handle view change in the calendar
  const handleViewChange = useCallback((view) => {
    console.log("View changed to:", view);
    setView(view); // Directly set the view state
  }, []);

  const getTitle = (event) => {
    if(event.booked===true && event.bookedBy){
      return event.bookedBy.family_name + " " + event.bookedBy.given_name  
    }
    if(event.status==='Cancel'){
      return "Cancelled"
    }
    if(event.status==='Complete'){
      return "Completed"
    }
    
    return `${event.title}`;
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}/counsellor/availabilityByUser/${localStorage.getItem('userId')}`);
      console.log("Events fetched:", response.data);
      const eventLists = await response.data.map(event => ({
        title: getTitle(event),
        start:  event.start, // Ensure start is a Date object
        end: event.end,     // Ensure end is a Date object
        booked: event.booked,
        id: event._id,
        bookedBy: event.bookedBy,
        status: event.status
      }));
 
      setAllEvents(eventLists);
    } catch (error) {
      setAllEvents([]);
      console.error("Error fetching events:", error);
    }
  };

  
  
      const handleBookingStatus = async (status) => {
        
          Swal.fire({
              title: "Are you sure?",
              text: `Do you want to ${status} this slot?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, " + status + " it!",
            }).then(async (result) => {
              if (result.isConfirmed) {
                // Perform the delete action
                try {
                  setLoading(true);
                  const apiUrl = new URL(
                      `booking/update-booking/${selectedEvent.id}`,
                      config.baseUrl
                  ).href;
                  const response = await axios.put(apiUrl, {...selectedEvent , status , user: localStorage.getItem('userId')}); // API call
                  console.log("Booking response:", response.data);
                  
                  Swal.fire(`${status}!`, `Your slot has been ${status}.`, "success");
                  setLoading(false);
                  setIsOnselectEventModalOpen(false)
                  fetchAvailability();  
              } catch (error) {
                  setLoading(false);
                  console.error(`Error ${status} slot:`, error);
              }
              }
            });
  
          
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
      <h2>📅 Availability Scheduler</h2>
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
      

      {/* CoreUI Modal for Setting Availability */}
      <CModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal when clicked on overlay or cancel
        size="lg"
      >
        <CModalHeader>
          <h5>Set Availability</h5>
        </CModalHeader>
        <CModalBody>
          <div>
            <label>
              Start Date and Time:
              <input
                type="datetime-local"
                value={moment(selectedRange.start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => handleDateRangeChange(new Date(e.target.value), selectedRange.end)}
                className="form-control" // Bootstrap class for styling
              />
            </label>
            <br />
            <label>
              End Date and Time:
              <input
                type="datetime-local"
                value={moment(selectedRange.end).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => handleDateRangeChange(selectedRange.start, new Date(e.target.value))}
                className="form-control" // Bootstrap class for styling
              />
            </label>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSave}>Save Availability</CButton>
          <CButton color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={isOnselectEventModalOpen}
        onClose={() => setIsOnselectEventModalOpen(false)} // Close the modal when clicked on overlay or cancel
        size="md"
      >
        <CModalHeader>
          <h5>Session Action</h5>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
        <CButton color="primary" className="form-control" onClick={()=>handleBookingStatus('Complete')}>Complete Session</CButton>
              </CCol>
              <CCol md={6}>
          <CButton color="danger" className="form-control" onClick={() => handleBookingStatus('Cancel')}>Cancel Session </CButton>
              </CCol>
          </CRow>
        </CModalBody>
        
      </CModal>
    </div>
  );
}
 
