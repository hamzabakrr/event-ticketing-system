import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../api';
import { getEventImage } from '../utils/imageUtils';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      // Filter out any bookings with missing event data
      const validBookings = response.data.filter(booking => booking && booking.event);
      setBookings(validBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      // Update the booking status in the local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!booking || !booking.event || !booking.event.date) return false;
    
    const eventDate = new Date(booking.event.date);
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return eventDate >= now && booking.status !== 'cancelled';
      case 'past':
        return eventDate < now && booking.status !== 'cancelled';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
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
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-md ${
            filter === 'upcoming'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Upcoming
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
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-md ${
            filter === 'cancelled'
              ? 'bg-red-100 text-red-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Cancelled
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 mb-4">No bookings found</h3>
          <p className="text-gray-500">
            {filter === 'upcoming'
              ? "You don't have any upcoming bookings."
              : filter === 'past'
              ? "You don't have any past bookings."
              : "You don't have any cancelled bookings."}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map(booking => {
            if (!booking || !booking.event) return null;
            
            return (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        {...getEventImage(booking.event.image)}
                        alt={booking.event.title || 'Event'}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <h2 className="text-xl font-semibold">
                        <Link
                          to={`/events/${booking.event._id}`}
                          className="hover:text-blue-600"
                        >
                          {booking.event.title || 'Untitled Event'}
                        </Link>
                      </h2>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Event Date & Time</p>
                      <p className="font-medium">
                        {booking.event.date ? format(new Date(booking.event.date), 'PPP') : 'Date TBA'} 
                        {booking.event.time ? ` at ${booking.event.time}` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium">
                        {booking.event.location?.name || 'Venue TBA'}
                        {booking.event.location?.area ? `, ${booking.event.location.area}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Tickets</h3>
                    <div className="space-y-2">
                      {(booking.tickets || []).map((ticket, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>Ticket #{index + 1}</span>
                          <span className="text-gray-600">
                            {ticket.quantity || 0} × {(ticket.price || 0).toLocaleString('en-EG', {
                              style: 'currency',
                              currency: 'EGP'
                            })}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t text-lg font-semibold">
                        <span>Total</span>
                        <span>
                          {(booking.totalAmount || 0).toLocaleString('en-EG', {
                            style: 'currency',
                            currency: 'EGP'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.status !== 'cancelled' && booking.event.date && new Date(booking.event.date) > new Date() && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserBookings; 