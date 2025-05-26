// src/components/organizer/EventForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', ticketCount: 0, price: 0
  });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/organizer/events', formData)
      .then(() => alert('Event created successfully'))
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} required />
      <input name="date" type="date" value={formData.date} onChange={handleChange} required />
      <input name="location" value={formData.location} onChange={handleChange} required />
      <input name="ticketCount" type="number" value={formData.ticketCount} onChange={handleChange} required />
      <input name="price" type="number" value={formData.price} onChange={handleChange} required />
      <button type="submit">Create Event</button>
    </form>
  )}