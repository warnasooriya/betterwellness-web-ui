import React, { useState, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from "@coreui/react"; // Corrected imports
import { useDispatch, useSelector } from 'react-redux'
import { setEvent  } from '../reducers/availabilityReducer'

const localizer = momentLocalizer(moment);

export default function AvailabilitySetup() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [view, setView] = useState("month");

  // Function to handle slot selection and open the modal
  const handleSelectSlot = useCallback(({ start, end }) => {
    console.log("Selected range:", start, end);

    // Only set selected range if the slot selection has changed
    if (selectedRange.start !== start || selectedRange.end !== end) {
      setSelectedRange({ start, end });
      setIsModalOpen(true); // Open the modal when a slot is selected
    }
  }, [selectedRange]);


  const events = useSelector(state => state.availabilityReducer.events)
  const dispatch = useDispatch()


  const setEvents = (e) => {
    debugger;
    dispatch(setEvent(e));
  }

  // Function to handle date range changes in the modal
  const handleDateRangeChange = useCallback((newStart, newEnd) => {
    setSelectedRange({ start: newStart, end: newEnd });
  }, []);

  // Function to handle event creation after setting availability
  const handleSave = useCallback(() => {
    const { start, end } = selectedRange;
    if (start && end) {
      // neet to get the from time and to time as title
      debugger;
      // const title = `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`;
      const title = `Available`;


      // const title = start.toLocaleString(); // Example title for the event
      if (title) {
        setEvents( 
          { title, start, end },
        );
      }
    }
    setIsModalOpen(false); // Close the modal after saving
  }, [selectedRange]);

  // Function to handle view change in the calendar
  const handleViewChange = useCallback((view) => {
    console.log("View changed to:", view);
    setView(view); // Directly set the view state
  }, []);

  // Navigation Functions
  const handleBack = useCallback(() => {
    const newDate = moment().subtract(1, "month"); // Example for "Back" functionality
    setSelectedRange({
      start: newDate.startOf("month").toDate(),
      end: newDate.endOf("month").toDate(),
    });
  }, []);

  const handleToday = useCallback(() => {
    const today = moment();
    setSelectedRange({
      start: today.startOf("day").toDate(),
      end: today.endOf("day").toDate(),
    });
  }, []);

  const handleNext = useCallback(() => {
    const newDate = moment().add(1, "month"); // Example for "Next" functionality
    setSelectedRange({
      start: newDate.startOf("month").toDate(),
      end: newDate.endOf("month").toDate(),
    });
  }, []);

  return (
    <div>
      <h2>📅 Availability Scheduler</h2>

      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        view={view}
        onSelectSlot={handleSelectSlot} // Open the modal when selecting a slot
        onView={handleViewChange} // Handle view change
        onSelectEvent={(event) => console.log("Selected event:", event)} // Handle event selection
        style={{ height: 600 }} // Example height for the calendar
        views={["month", "week", "day", "agenda"]}
        min={moment().startOf("day").toDate()} // Minimum date selection (based on selected range)
        max={moment().endOf("day").toDate()} // Maximum date selection (based on selected range)
        timeslots={1}  // This defines that each slot is 1 hour in "day" and "week" views
        step={30}      // This defines that each slot interval is 30 minutes
        onNavigate={(date) => setSelectedRange({ start: date, end: date })}
        eventPropGetter={(event) => (
          {
          className: "custom-event-class",
          style: {
            backgroundColor: "#3788d8",
            color: "white",
            fontSize: "14px",
            padding: "5px"
          },
        })}
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
    </div>
  );
}
