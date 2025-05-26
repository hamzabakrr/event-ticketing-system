import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
<<<<<<< HEAD
import { toast } from 'react-toastify';
=======
>>>>>>> origin/main

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
<<<<<<< HEAD
    phone: '',
    role: 'user',
    address: {
      street: '',
      area: 'Other',
      city: 'Cairo'
    }
=======
    role: 'user'
>>>>>>> origin/main
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
<<<<<<< HEAD
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
=======
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
>>>>>>> origin/main
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

<<<<<<< HEAD
    // Validate Egyptian phone number
    const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid Egyptian phone number');
      return;
    }

=======
>>>>>>> origin/main
    setLoading(true);
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
<<<<<<< HEAD
        role: formData.role,
        phone: formData.phone,
        address: formData.address
      });
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
=======
        role: formData.role
      });
      if (success) {
        navigate('/');
      }
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="max-w-md mx-auto mt-10 mb-10">
=======
    <div className="max-w-md mx-auto mt-10">
>>>>>>> origin/main
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
<<<<<<< HEAD
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone Number (Egyptian)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 01234567890"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
=======
>>>>>>> origin/main
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
<<<<<<< HEAD
          <div className="mb-4">
=======
          <div className="mb-6">
>>>>>>> origin/main
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
<<<<<<< HEAD
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.street">
              Street Address
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address.area">
              Area
            </label>
            <select
              id="address.area"
              name="address.area"
              value={formData.address.area}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Other">Other</option>
              <option value="Maadi">Maadi</option>
              <option value="Heliopolis">Heliopolis</option>
              <option value="Nasr City">Nasr City</option>
              <option value="New Cairo">New Cairo</option>
              <option value="Downtown">Downtown</option>
              <option value="6th of October">6th of October</option>
              <option value="Zamalek">Zamalek</option>
            </select>
          </div>
=======
>>>>>>> origin/main
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 