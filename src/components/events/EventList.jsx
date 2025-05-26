// src/components/events/EventList.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
    date: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events', { params: filters });
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Discover Events in Cairo</h1>
      
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="rounded-lg border-gray-300"
        >
          <option value="">All Categories</option>
          <option value="Concert">Concerts</option>
          <option value="Sports">Sports</option>
          <option value="Theater">Theater</option>
          <option value="Conference">Conferences</option>
          <option value="Exhibition">Exhibitions</option>
          <option value="Festival">Festivals</option>
        </select>

        <select
          name="area"
          value={filters.area}
          onChange={handleFilterChange}
          className="rounded-lg border-gray-300"
        >
          <option value="">All Areas</option>
          <option value="Maadi">Maadi</option>
          <option value="Heliopolis">Heliopolis</option>
          <option value="Nasr City">Nasr City</option>
          <option value="New Cairo">New Cairo</option>
          <option value="Downtown">Downtown</option>
          <option value="6th of October">6th of October</option>
          <option value="Zamalek">Zamalek</option>
        </select>

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="rounded-lg border-gray-300"
        />
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl mb-4">No events found</p>
          <p>Try adjusting your filters or check back later for new events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
