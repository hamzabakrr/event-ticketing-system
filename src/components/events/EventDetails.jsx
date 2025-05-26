// src/components/events/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { getEventImage } from '../../utils/imageUtils';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      // Initialize selected tickets
      const initialTickets = {};
      response.data.ticketTypes.forEach(type => {
        initialTickets[type.type] = 0;
      });
      setSelectedTickets(initialTickets);
    } catch (error) {
      toast.error('Failed to fetch event details');
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketChange = (ticketType, value) => {
    const newValue = Math.max(0, Math.min(value, event.ticketTypes.find(t => t.type === ticketType).available));
    setSelectedTickets(prev => ({
      ...prev,
      [ticketType]: newValue
    }));
  };

  const calculateTotal = () => {
    return event.ticketTypes.reduce((total, ticket) => {
      return total + (selectedTickets[ticket.type] * ticket.price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    const ticketsSelected = Object.values(selectedTickets).some(qty => qty > 0);
    if (!ticketsSelected) {
      toast.error('Please select at least one ticket');
      return;
    }

    try {
      const tickets = event.ticketTypes
        .filter(type => selectedTickets[type.type] > 0)
        .map(type => ({
          type: type.type,
          quantity: selectedTickets[type.type],
          pricePerTicket: type.price
        }));

      const booking = {
        event: id,
        tickets,
        totalAmount: calculateTotal(),
        paymentMethod,
        contactInfo
      };

      const response = await api.post('/api/bookings', booking);
      toast.success('Booking successful!');
      navigate(`/bookings/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Event Details */}
        <div>
          <img 
            src={getEventImage(event.image)}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getEventImage(null);
            }}
          />
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-lg mb-2">
              {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} at {event.time}
            </p>
            <p className="text-gray-600 mb-2">
              {event.location.name}
            </p>
            <p className="text-gray-600">
              {event.location.area}, {event.location.city}
            </p>
          </div>
          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Book Tickets</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Ticket Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Tickets</h3>
                {event.ticketTypes.map((ticket) => (
                  <div key={ticket.type} className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-medium">{ticket.type}</p>
                      <p className="text-gray-600">{ticket.price} EGP</p>
                      <p className="text-sm text-gray-500">
                        {ticket.available} tickets available
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={ticket.available}
                      value={selectedTickets[ticket.type] || 0}
                      onChange={(e) => handleTicketChange(ticket.type, parseInt(e.target.value))}
                      className="w-20 p-2 border rounded"
                    />
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      className="mt-1 w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="mt-1 w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="mt-1 w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="fawry">Fawry</option>
                  <option value="vodafone_cash">Vodafone Cash</option>
                </select>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold">{calculateTotal()} EGP</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
