// src/components/events/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getEventImage } from '../../utils/imageUtils';

const EventCard = ({ event }) => {
  const lowestPrice = Math.min(...event.ticketTypes.map(ticket => ticket.price));
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={getEventImage(event.image)}
        alt={event.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getEventImage(null);
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {event.category}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-2">
            {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} at {event.time}
          </p>
          <p className="text-gray-600 text-sm">
            {event.location.name}, {event.location.area}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Starting from</p>
            <p className="text-lg font-bold text-gray-800">{lowestPrice} EGP</p>
          </div>
          <Link
            to={`/events/${event._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>

        {event.ticketTypes.some(ticket => ticket.available === 0) && (
          <p className="mt-2 text-red-600 text-sm">Limited tickets available!</p>
        )}
      </div>
    </div>
  );
};

export default EventCard;
