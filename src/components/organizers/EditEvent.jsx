import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    image: '',
    location: {
      name: '',
      area: '',
      city: 'Cairo'
    },
    ticketTypes: []
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/organizer/events/${id}`);
      const event = response.data;
      
      // Format date for input field
      const dateObj = new Date(event.date);
      const formattedDate = dateObj.toISOString().split('T')[0];

      setFormData({
        ...event,
        date: formattedDate
      });
    } catch (error) {
      toast.error('Error fetching event details');
      navigate('/organizer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTicketTypeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) =>
        i === index ? { ...ticket, [field]: field === 'type' ? value : Number(value) } : ticket
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/organizer/events/${id}`, formData);
      toast.success('Event updated successfully');
      navigate('/organizer');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded"
                >
                  <option value="Concert">Concert</option>
                  <option value="Sports">Sports</option>
                  <option value="Theater">Theater</option>
                  <option value="Festival">Festival</option>
                  <option value="Exhibition">Exhibition</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Date and Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                <input
                  type="text"
                  name="location.name"
                  value={formData.location.name}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Area</label>
                <select
                  name="location.area"
                  value={formData.location.area}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded"
                >
                  <option value="Nasr City">Nasr City</option>
                  <option value="Maadi">Maadi</option>
                  <option value="Heliopolis">Heliopolis</option>
                  <option value="Downtown">Downtown</option>
                  <option value="Zamalek">Zamalek</option>
                  <option value="New Cairo">New Cairo</option>
                  <option value="6th of October">6th of October</option>
                  <option value="Borg El Arab">Borg El Arab</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Event Image</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Ticket Types */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Ticket Types</h2>
            {formData.ticketTypes.map((ticket, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <input
                    type="text"
                    value={ticket.type}
                    onChange={(e) => handleTicketTypeChange(index, 'type', e.target.value)}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (EGP)</label>
                  <input
                    type="number"
                    value={ticket.price}
                    onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                    className="mt-1 w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Available</label>
                  <input
                    type="number"
                    value={ticket.available}
                    onChange={(e) => handleTicketTypeChange(index, 'available', e.target.value)}
                    className="mt-1 w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent; 