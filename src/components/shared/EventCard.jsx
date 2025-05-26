import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    description,
    date,
    location,
    price,
    ticketTypes,
    image,
    status = 'approved'
  } = event;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketAvailability = () => {
    const totalAvailable = ticketTypes.reduce((sum, type) => sum + type.available, 0);
    if (totalAvailable === 0) {
      return <span className="text-red-600 font-semibold">Sold Out</span>;
    }
    if (totalAvailable <= 10) {
      return <span className="text-orange-600 font-semibold">Only {totalAvailable} tickets left!</span>;
    }
    return <span className="text-green-600 font-semibold">{totalAvailable} tickets available</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={image || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={title}
          className="w-full h-full object-cover"
        />
        {status !== 'approved' && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(new Date(date), 'PPP')}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location.name}, {location.area}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Starting from {price} EGP
          </div>

          <div className="text-sm">
            {getTicketAvailability()}
          </div>
        </div>

        <Link
          to={`/events/${_id}`}
          className="block mt-4 text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard; 