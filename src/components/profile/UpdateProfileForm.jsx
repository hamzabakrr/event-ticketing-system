// src/components/profile/UpdateProfileForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProfileForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    axios.get('/api/users/me')
      .then(response => setFormData({ name: response.data.name, email: response.data.email }))
      .catch(error => console.error(error));
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.put('/api/users/me', formData)
      .then(() => alert('Profile updated successfully'))
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} required />
      <input name="email" value={formData.email} onChange={handleChange} required />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UpdateProfileForm;
