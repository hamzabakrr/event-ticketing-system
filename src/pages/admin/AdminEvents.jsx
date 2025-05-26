import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../../api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, declined
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await api.patch(`/admin/events/${eventId}/status`, { status: newStatus });
      toast.success(`Event ${newStatus} successfully`);
      setEvents(events.map(event => 
        event._id === eventId 
          ? { ...event, status: newStatus }
          : event
      ));
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/admin/events/${eventId}`);
      toast.success('Event deleted successfully');
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Events</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md ${
              filter === 'approved'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('declined')}
            className={`px-4 py-2 rounded-md ${
              filter === 'declined'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Declined
          </button>
        </div>

        <input
          type="text"
          placeholder="Search events or organizers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Events Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map(event => (
                <tr key={event._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={event.image || 'https://via.placeholder.com/150'}
                        alt={event.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{event.organizer.name}</div>
                    <div className="text-sm text-gray-500">{event.organizer.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {format(new Date(event.date), 'PPP')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.location.name}, {event.location.area}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        event.status
                      )}`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <Link
                      to={`/events/${event._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    {event.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(event._id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(event._id, 'declined')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 mb-4">No events found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? "No events match your search criteria"
              : `No ${filter} events found`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminEvents; 