import React, { useState, useEffect } from 'react';
import EventCard from '@/components/shared/EventCard';
import { getAllEvents } from '@/lib/appwrite/api';
import { CalendarEvent } from '@/types/index';

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

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

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-semibold mb-6">Event List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventPage;