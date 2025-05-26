import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';
import EventCard from '../../components/shared/EventCard';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, past, draft

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/organizer/events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();

    switch (filter) {
      case 'active':
        return eventDate >= now;
      case 'past':
        return eventDate < now;
      case 'draft':
        return event.status === 'draft';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Link
          to="/my-events/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Create Event
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-md ${
            filter === 'active'
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-md ${
            filter === 'past'
              ? 'bg-gray-100 text-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Past
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-md ${
            filter === 'draft'
              ? 'bg-yellow-100 text-yellow-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Drafts
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 mb-4">No events found</h3>
          <p className="text-gray-500">
            {filter === 'all'
              ? "You haven't created any events yet."
              : `You don't have any ${filter} events.`}
          </p>
          <Link
            to="/my-events/new"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <div key={event._id} className="relative group">
              <EventCard event={event} />
              
              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-4">
                <Link
                  to={`/my-events/${event._id}/edit`}
                  className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <Link
                  to={`/my-events/${event._id}/analytics`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents; 