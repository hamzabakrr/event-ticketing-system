import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
  });

  useEffect(() => {
    fetchEvents();
<<<<<<< HEAD
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
=======
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/events?${queryParams}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
<<<<<<< HEAD
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
=======
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
>>>>>>> origin/main
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
          
=======
    <div>
      {/* Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
>>>>>>> origin/main
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
<<<<<<< HEAD
            className="rounded px-4 py-2 text-gray-800"
          >
            <option value="">All Categories</option>
            <option value="concert">Concerts</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
            <option value="conference">Conferences</option>
            <option value="exhibition">Exhibitions</option>
=======
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Concert">Concerts</option>
            <option value="Sports">Sports</option>
            <option value="Theater">Theater</option>
            <option value="Festival">Festivals</option>
            <option value="Exhibition">Exhibitions</option>
>>>>>>> origin/main
          </select>

          <select
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
        </div>
      )}
    </div>
  );
};

export default Home; 