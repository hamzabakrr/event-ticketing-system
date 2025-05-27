import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getEventImage } from '../utils/imageUtils';

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
        const calculatedPrice = ticketType.price * quantity;
        setTotalPrice(calculatedPrice);
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

      const calculatedTotalPrice = ticketType.price * quantity;
      if (isNaN(calculatedTotalPrice) || calculatedTotalPrice <= 0) {
        toast.error('Invalid total price calculation');
        return;
      }

      const response = await api.endpoints.bookings.create({
        eventId: event._id,
        ticketType: selectedTicketType,
        quantity: quantity,
        totalPrice: calculatedTotalPrice
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={getEventImage(event.image)}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getEventImage(null);
            }}
          />
          <h1 className="text-3xl font-bold mt-6 mb-4">{event.title}</h1>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Date:</span>{' '}
              {format(new Date(event.date), 'MMMM d, yyyy')}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Time:</span> {event.time}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Location:</span>{' '}
              {event.location.name}, {event.location.area}
            </p>
          </div>
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">About This Event</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Book Tickets</h2>
          <form onSubmit={handleBooking}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Ticket Type
              </label>
              <select
                value={selectedTicketType}
                onChange={handleTicketTypeChange}
                className="w-full p-2 border rounded"
                required
              >
                {event.ticketTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.type} - {type.price} EGP ({type.available} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-6">
              <p className="text-lg font-bold">
                Total Price: {totalPrice} EGP
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 