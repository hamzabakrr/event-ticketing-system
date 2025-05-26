import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      // Initialize selected tickets
      const initialTickets = {};
      response.data.ticketTypes.forEach(type => {
        initialTickets[type._id] = 0;
      });
      setSelectedTickets(initialTickets);
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketChange = (ticketId, change) => {
    setSelectedTickets(prev => {
      const currentAmount = prev[ticketId] || 0;
      const newAmount = Math.max(0, currentAmount + change);
      const ticketType = event.ticketTypes.find(t => t._id === ticketId);
      
      if (newAmount > ticketType.available) {
        toast.error(`Only ${ticketType.available} tickets available`);
        return prev;
      }
      
      return {
        ...prev,
        [ticketId]: newAmount
      };
    });
  };

  const calculateTotal = () => {
    return event.ticketTypes.reduce((total, type) => {
      return total + (selectedTickets[type._id] * type.price);
    }, 0);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    const ticketsToBook = Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketId, quantity]) => ({
        ticketType: ticketId,
        quantity
      }));

    if (ticketsToBook.length === 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    try {
      setIsBooking(true);
      await api.post(`/events/${id}/book`, { tickets: ticketsToBook });
      toast.success('Booking successful!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setIsBooking(false);
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
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600">Event not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Details */}
        <div>
          <img
            src={event.image || 'https://via.placeholder.com/800x400?text=No+Image'}
            alt={event.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
          />

          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(event.date), 'PPP')} at {event.time}
            </div>

            <div className="flex items-center text-gray-600">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location.name}, {event.location.area}
            </div>

            <p className="text-gray-600">{event.location.address}</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="lg:pl-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Select Tickets</h2>

            <div className="space-y-4 mb-6">
              {event.ticketTypes.map(ticket => (
                <div key={ticket._id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <h3 className="font-semibold">{ticket.name}</h3>
                    <p className="text-sm text-gray-600">{ticket.description}</p>
                    <p className="text-lg font-semibold mt-1">
                      {ticket.price.toLocaleString('en-EG', {
                        style: 'currency',
                        currency: 'EGP'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.available} tickets available
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTicketChange(ticket._id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      disabled={selectedTickets[ticket._id] === 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{selectedTickets[ticket._id]}</span>
                    <button
                      onClick={() => handleTicketChange(ticket._id, 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      disabled={selectedTickets[ticket._id] === ticket.available}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>
                  {calculateTotal().toLocaleString('en-EG', {
                    style: 'currency',
                    currency: 'EGP'
                  })}
                </span>
              </div>

              <button
                onClick={handleBooking}
                disabled={isBooking || calculateTotal() === 0}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                  isBooking || calculateTotal() === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isBooking ? 'Processing...' : 'Book Now'}
              </button>

              {!user && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  Please{' '}
                  <button
                    onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    login
                  </button>{' '}
                  to book tickets
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 