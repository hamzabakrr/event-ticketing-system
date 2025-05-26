import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: {
      name: '',
      area: '',
      address: ''
    },
    category: '',
    image: '',
    ticketTypes: [
      {
        name: 'Regular',
        price: '',
        quantity: '',
        description: ''
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setEvent(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setEvent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTicketTypeChange = (index, field, value) => {
    setEvent(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const addTicketType = () => {
    setEvent(prev => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        {
          name: '',
          price: '',
          quantity: '',
          description: ''
        }
      ]
    }));
  };

  const removeTicketType = (index) => {
    if (event.ticketTypes.length > 1) {
      setEvent(prev => ({
        ...prev,
        ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append event data
      Object.keys(event).forEach(key => {
        if (key === 'ticketTypes') {
          formData.append(key, JSON.stringify(event[key]));
        } else if (key === 'location') {
          formData.append(key, JSON.stringify(event[key]));
        } else {
          formData.append(key, event[key]);
        }
      });

      await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Event created successfully!');
      navigate('/my-events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                name="title"
                value={event.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={event.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={event.date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  value={event.time}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={event.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option value="concert">Concert</option>
                <option value="sports">Sports</option>
                <option value="theater">Theater</option>
                <option value="conference">Conference</option>
                <option value="exhibition">Exhibition</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Event Image</label>
              <input
                type="file"
                name="image"
                onChange={(e) => setEvent(prev => ({ ...prev, image: e.target.files[0] }))}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Location Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Venue Name</label>
              <input
                type="text"
                name="location.name"
                value={event.location.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <select
                name="location.area"
                value={event.location.area}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select an area</option>
                <option value="cairo">Cairo</option>
                <option value="giza">Giza</option>
                <option value="alexandria">Alexandria</option>
                <option value="sharmelsheikh">Sharm El Sheikh</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Address</label>
              <textarea
                name="location.address"
                value={event.location.address}
                onChange={handleChange}
                required
                rows={2}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ticket Types */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ticket Types</h2>
            <button
              type="button"
              onClick={addTicketType}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              + Add Ticket Type
            </button>
          </div>

          <div className="space-y-6">
            {event.ticketTypes.map((ticket, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ticket Name</label>
                    <input
                      type="text"
                      value={ticket.name}
                      onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                      required
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (EGP)</label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                      required
                      min="0"
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity Available</label>
                    <input
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                      required
                      min="1"
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      value={ticket.description}
                      onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                      placeholder="e.g., Early bird, VIP, Regular"
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/my-events')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent; 