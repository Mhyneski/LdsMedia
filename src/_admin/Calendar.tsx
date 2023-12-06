// CustomCalendar.tsx
import React, { useState, useEffect } from 'react';
import moment from 'moment'; // Add this line
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event, CalendarEvent } from '../types/index'; // Import your event interfaces
import { createEvent, getAllEvents } from '../lib/appwrite/api'; // Import your API functions

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CustomCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      const transformedData: CalendarEvent[] = data.map((document) => ({
        id: document.$id,
        title: document.title,
        start: new Date(document.start),
        end: new Date(document.end),
      }));

      setEvents(transformedData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventDrop = async ({ event, start, end }: any) => {
    console.log('Event dropped:', event, start, end);
    // Update your event in the database
    // Call your API to update the event with new start and end dates
  };

  const handleSelectSlot = (slotInfo: any) => {
    const { start, end } = slotInfo;
    const newEventObject: Event = {
      title: 'New Event',
      start,
      end,
    };

    setNewEvent(newEventObject);
  };

  const handleSaveEvent = async () => {
    if (newEvent) {
      try {
        // Call your API to create a new event
        const createdEvent = await createEvent(newEvent);

        // Add the new event to the state
        setEvents([...events, createdEvent]);
      } catch (error) {
        console.error('Error creating event:', error);
      }

      // Reset the new event state
      setNewEvent(null);
    }
  };

  return (
    <div className="calendar-container " style={{ backgroundColor: 'black', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: 'auto' }}>
        <DnDCalendar
          localizer={localizer}
          events={events}
          defaultView={Views.MONTH}
          onSelectEvent={(event) => console.log('Event selected:', event)}
          onEventDrop={handleEventDrop}
          resizable
          selectable
          onSelectSlot={handleSelectSlot}
          style={{ height: '80vh', marginBottom: '20px' }}
        />

        {/* New Event Form */}
        {newEvent && (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px' }}>
            <h3>Create New Event</h3>
            <label>Title:</label>
            <input
              className='text-black'
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <label>Start:</label>
            <input
              className='text-black'
              type="datetime-local"
              value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
            />
            <label>End:</label>
            <input
              className='text-black'
              type="datetime-local"
              value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
            />
            <button onClick={handleSaveEvent}>Save Event</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
