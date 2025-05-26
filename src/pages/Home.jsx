import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { format } from 'date-fns';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
    date: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/events?${queryParams}`);
      setEvents(response.data);
    } catch (error) {
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Concert">Concerts</option>
            <option value="Sports">Sports</option>
            <option value="Theater">Theater</option>
            <option value="Festival">Festivals</option>
            <option value="Exhibition">Exhibitions</option>
          </select>

          <select
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Areas</option>
            <option value="Nasr City">Nasr City</option>
            <option value="Maadi">Maadi</option>
            <option value="Heliopolis">Heliopolis</option>
            <option value="Downtown">Downtown</option>
            <option value="Zamalek">Zamalek</option>
            <option value="New Cairo">New Cairo</option>
            <option value="6th of October">6th of October</option>
            <option value="Borg El Arab">Borg El Arab</option>
          </select>

          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event._id}
            to={`/events/${event._id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-2">
                {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
              </p>
              <p className="text-gray-600 mb-2">
                {event.location.name}, {event.location.area}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-blue-600 font-semibold">
                  From {Math.min(...event.ticketTypes.map(t => t.price))} EGP
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  event.category === 'Concert' ? 'bg-purple-100 text-purple-800' :
                  event.category === 'Sports' ? 'bg-red-100 text-red-800' :
                  event.category === 'Theater' ? 'bg-green-100 text-green-800' :
                  event.category === 'Festival' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No events found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default Home; 