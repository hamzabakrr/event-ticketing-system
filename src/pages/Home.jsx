import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import EventCard from '../components/shared/EventCard';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    area: searchParams.get('area') || '',
    date: searchParams.get('date') || '',
    priceRange: searchParams.get('priceRange') || ''
  });

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries([...searchParams]);
      const response = await api.get('/events', { params });
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Find Your Next Event</h1>
        <p className="text-lg mb-6">Discover amazing events happening in Egypt</p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search events..."
            className="rounded px-4 py-2 text-gray-800"
          />
          
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="rounded px-4 py-2 text-gray-800"
          >
            <option value="">All Categories</option>
            <option value="concert">Concerts</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
            <option value="conference">Conferences</option>
            <option value="exhibition">Exhibitions</option>
          </select>

          <select
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
            className="rounded px-4 py-2 text-gray-800"
          >
            <option value="">All Areas</option>
            <option value="cairo">Cairo</option>
            <option value="giza">Giza</option>
            <option value="alexandria">Alexandria</option>
            <option value="sharmelsheikh">Sharm El Sheikh</option>
          </select>

          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleFilterChange}
            className="rounded px-4 py-2 text-gray-800"
          >
            <option value="">Any Price</option>
            <option value="0-100">0-100 EGP</option>
            <option value="100-500">100-500 EGP</option>
            <option value="500-1000">500-1000 EGP</option>
            <option value="1000+">1000+ EGP</option>
          </select>

          <button
            type="submit"
            className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-blue-50 transition duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No events found matching your criteria</h3>
          <button
            onClick={() => {
              setFilters({
                search: '',
                category: '',
                area: '',
                date: '',
                priceRange: ''
              });
              setSearchParams({});
            }}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home; 