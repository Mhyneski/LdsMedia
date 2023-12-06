import React from 'react';
import { CalendarEvent } from '@/types/index';

interface EventCardProps {
  event: CalendarEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="max-w-sm mx-auto bg-gray-800 text-white shadow-md rounded-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-400 mb-4">{event.start.toLocaleString()}</p>
        <p className="text-gray-400">{event.end.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default EventCard;