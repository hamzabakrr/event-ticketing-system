import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Email Sent!</h2>
          <p className="text-gray-600 mb-6">
            Please check your email for instructions to reset your password.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your email address"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 