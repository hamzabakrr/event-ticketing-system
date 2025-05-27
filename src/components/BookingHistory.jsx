import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../api/index';
import { toast } from 'react-toastify';
import { getEventImage } from '../utils/imageUtils';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.endpoints.bookings.getMyBookings();
      if (response?.data) {
        // Process images for each booking's event
        const processedBookings = await Promise.all(
          response.data.map(async (booking) => {
            if (booking.event?.image) {
              booking.event.image = await getEventImage(booking.event.image);
            }
            return booking;
          })
        );
        setBookings(processedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error fetching booking history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
        <p className="text-gray-600">You haven't made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Booking History</h2>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {booking.event?.title || 'Event Unavailable'}
                  </h3>
                  {booking.event && (
                    <>
                      <p className="text-gray-600">
                        {format(new Date(booking.event.date), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-gray-600">
                        {booking.event.location?.name} 
                        {booking.event.location?.area && `, ${booking.event.location.area}`}
                      </p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  } mt-2`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div>
                    <h4 className="font-semibold">Quantity</h4>
                    <p>{booking.quantity} ticket(s)</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-semibold">Total Price</h4>
                    <p>{booking.totalPrice?.toFixed(2) || 0} EGP</p>
                  </div>
                </div>
                {booking.contactInfo && (
                  <div className="mt-4 text-sm text-gray-600">
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <p>Name: {booking.contactInfo.name}</p>
                    <p>Email: {booking.contactInfo.email}</p>
                    {booking.contactInfo.phone && (
                      <p>Phone: {booking.contactInfo.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory; 