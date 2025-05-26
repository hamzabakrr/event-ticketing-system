import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        if (response.data.ticketTypes.length > 0) {
          setSelectedTicketType(response.data.ticketTypes[0].type);
          setTotalPrice(response.data.ticketTypes[0].price);
        }
      } catch (error) {
        toast.error('Error fetching event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event && selectedTicketType) {
      const ticketType = event.ticketTypes.find(t => t.type === selectedTicketType);
      if (ticketType) {
        setTotalPrice(ticketType.price * quantity);
      }
    }
  }, [selectedTicketType, quantity, event]);

  const handleTicketTypeChange = (e) => {
    setSelectedTicketType(e.target.value);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    try {
      const ticketType = event.ticketTypes.find(t => t.type === selectedTicketType);
      if (!ticketType) {
        toast.error('Invalid ticket type');
        return;
      }

      if (quantity > ticketType.available) {
        toast.error('Not enough tickets available');
        return;
      }

      await api.post('/bookings', {
        eventId: event._id,
        ticketType: selectedTicketType,
        quantity: quantity,
        totalPrice: totalPrice
      });

      toast.success('Booking successful!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center text-red-500">Event not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-96 object-cover"
      />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Event Details</h2>
              <p><span className="font-medium">Date:</span> {format(new Date(event.date), 'MMMM d, yyyy')}</p>
              <p><span className="font-medium">Time:</span> {event.time}</p>
              <p><span className="font-medium">Location:</span> {event.location.name}</p>
              <p><span className="font-medium">Area:</span> {event.location.area}</p>
              <p><span className="font-medium">City:</span> {event.location.city}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ticket Type</label>
                <select
                  value={selectedTicketType}
                  onChange={handleTicketTypeChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  {event.ticketTypes.map((ticket) => (
                    <option key={ticket.type} value={ticket.type}>
                      {ticket.type} - {ticket.price} EGP ({ticket.available} available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  Total Price: {totalPrice} EGP
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 