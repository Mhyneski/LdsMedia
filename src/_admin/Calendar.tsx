import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event, CalendarEvent } from '../types/index';
import { createEvent, deleteEvent, getAllEvents, updateEventInDatabase } from '../lib/appwrite/api';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CustomCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event> | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [updateFormData, setUpdateFormData] = useState({
    title: '',
    start: '',
    end: '',
  });
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showUpdateDeleteModal, setShowUpdateDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleEventDrop = async ({ event, start, end }: any) => {
    console.log('Event dropped:', event, start, end);
  };

  const handleSelectSlot = (slotInfo: any) => {
    const { start, end } = slotInfo;
    const newEventObject: Partial<Event> = {
      title: 'New Event',
      start,
      end,
    };

    setNewEvent(newEventObject);
    setShowNewEventModal(true);
  };

  const handleSaveEvent = async () => {
    if (newEvent) {
      try {
        const createdEvent = await createEvent(newEvent as Event);

        setEvents([...events, createdEvent]);
        setNewEvent(null);
        setShowNewEventModal(false);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };


  const handleDeleteEvent = async () => {
    try {
      if (selectedEvent) {
        await deleteEvent(selectedEvent.id);

        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        setSelectedEvent(null);
        setShowUpdateDeleteModal(false);

        console.log('Event deleted successfully');
      } else {
        console.warn('No event selected for deletion');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      if (selectedEvent) {
        const updatedEvent: CalendarEvent = {
          id: selectedEvent.id,
          title: updateFormData.title || selectedEvent.title,
          start: updateFormData.start ? new Date(updateFormData.start) : selectedEvent.start,
          end: updateFormData.end ? new Date(updateFormData.end) : selectedEvent.end,
        };        

        await updateEventInDatabase(updatedEvent);

        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === selectedEvent.id ? updatedEvent : event))
        );

        setSelectedEvent(null);
        setShowUpdateDeleteModal(false);
        setUpdateFormData({ title: '', start: '', end: '' });

        console.log('Event updated successfully');
      } else {
        console.warn('No event selected for update');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const openNewEventModal = () => {
    setShowNewEventModal(true);
  };

  const closeNewEventModal = () => {
    setShowNewEventModal(false);
  };

  const openUpdateDeleteModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setUpdateFormData({
      title: event.title,
      start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
    });
    setShowUpdateDeleteModal(true);
  };

  const closeUpdateDeleteModal = () => {
    setShowUpdateDeleteModal(false);
    setSelectedEvent(null);
    setUpdateFormData({ title: '', start: '', end: '' });
  };

  return (
    <div className="calendar-container" style={{ height: 'calc(100vh - 40px)', overflowY: 'auto', backgroundColor: 'black', color: 'white', padding: '20px' }}>
      <div className="max-w-screen-xl mx-auto" style={{ width: '170vh' }}>
      {loading ? (
          // Display a loading spinner or message while fetching events
          <div className='text-3xl text-center justify-center'>Loading...</div>
        ) : (
          <DnDCalendar
            localizer={localizer}
            events={events}
            defaultView={Views.MONTH}
            onSelectEvent={(event) => openUpdateDeleteModal(event as CalendarEvent)}
            onEventDrop={handleEventDrop}
            resizable
            selectable
            onSelectSlot={handleSelectSlot}
            style={{ height: '90vh', marginBottom: '20px' }}
          />
        )}
        {/* Create Event Modal */}
        {showNewEventModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-75 fixed top-0 left-0 w-full h-full" onClick={closeNewEventModal}></div>
            <div className="bg-white text-black p-4 rounded relative z-50">
              <h3>Create New Event</h3>
              <label>Title:</label>
              <input
                className="text-black"
                type="text"
                value={newEvent?.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <label>Start:</label>
              <input
                className="text-black"
                type="datetime-local"
                value={moment(newEvent?.start).format('YYYY-MM-DDTHH:mm') || ''}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              />
              <label>End:</label>
              <input
                className="text-black"
                type="datetime-local"
                value={moment(newEvent?.end).format('YYYY-MM-DDTHH:mm') || ''}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleSaveEvent}>Save Event</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded mt-2" onClick={closeNewEventModal}>Cancel</button>
            </div>
          </div>
        )}

        {/* Update/Delete Event Modal */}
        {showUpdateDeleteModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-75 fixed top-0 left-0 w-full h-full" onClick={closeUpdateDeleteModal}></div>
            <div className="bg-white text-black p-4 rounded relative z-50">
              <h3>Update/Delete Event</h3>
              <label>Title:</label>
              <input
                className="text-black"
                type="text"
                name="title"
                value={updateFormData.title}
                onChange={handleUpdateFormChange}
              />
              <label>Start:</label>
              <input
                className="text-black"
                type="datetime-local"
                name="start"
                value={updateFormData.start}
                onChange={handleUpdateFormChange}
              />
              <label>End:</label>
              <input
                className="text-black"
                type="datetime-local"
                name="end"
                value={updateFormData.end}
                onChange={handleUpdateFormChange}
              />
              <button className="bg-yellow-500 text-white px-4 py-2 rounded mt-4" onClick={handleUpdateEvent}>Update Event</button>
              <button className="bg-pink-500 text-white px-4 py-2 rounded mt-2" onClick={handleDeleteEvent}>Delete Event</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded mt-2" onClick={closeUpdateDeleteModal}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomCalendar;
