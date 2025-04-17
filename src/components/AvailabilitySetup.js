import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from "@coreui/react"; // Corrected imports
import { useDispatch, useSelector } from 'react-redux'
import './Availability.css'
import { setAvailability, setAllAvailabilities } from '../reducers/availabilityReducer'
import  useAxiosPrivate from "../hooks/useAxiosPrivate";
import config from "../api/config";
import LoadingOverlay from "./LoadingOverlay";
 

const localizer = momentLocalizer(moment);

export default function AvailabilitySetup() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnselectEventModalOpen,setIsOnselectEventModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [view, setView] = useState("month");
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
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
      


      // const title = start.toLocaleString(); // Example title for the event
      // if (title) {
      //   setEvents( 
      //     { title, start, end },
      //   );
      // }
    }
    setIsModalOpen(false); // Close the modal after saving
  }, [selectedRange]);


  const handleOnSelectEvent = (event) => {
    setIsOnselectEventModalOpen(true);
  };

  // Function to handle view change in the calendar
  const handleViewChange = useCallback((view) => {
    console.log("View changed to:", view);
    setView(view); // Directly set the view state
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}/counsellor/availabilityByUser/${localStorage.getItem('userId')}`);
      console.log("Events fetched:", response.data);
      const eventLists = await response.data.map(event => ({
        title: event.booked===true ? event.bookedBy.family_name + " " + event.bookedBy.given_name : event.title,
        start:  event.start, // Ensure start is a Date object
        end: event.end,     // Ensure end is a Date object
        booked: event.booked,
        id: event.id,
        bookedBy: event.bookedBy
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
          className: event?.booked ? "custom-booked-class" : "custom-event-class",
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
        size="sm"
      >
        <CModalHeader>
          <h5>Event Action</h5>
        </CModalHeader>
        <CModalBody>
        
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSave}>Complete Booking</CButton>
          <CButton color="danger" onClick={() => setIsModalOpen(false)}>Cancel Booking </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}
 
