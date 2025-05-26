import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getEventImage } from '../utils/imageUtils';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/organizer/events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/organizer/events/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Error deleting event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link
          to="/create-event"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
          <Link
            to="/create-event"
            className="text-blue-500 hover:text-blue-600"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-2">
                  {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                </p>
                <p className="text-gray-600 mb-4">
                  {event.location.name}, {event.location.area}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Tickets:</span>
                    <span className="ml-1 text-blue-600">
                      {event.ticketTypes.reduce((total, type) => total + type.available, 0)}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Link
                      to={`/edit-event/${event._id}`}
                      className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard; 