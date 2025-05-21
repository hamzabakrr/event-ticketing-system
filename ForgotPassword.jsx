import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ForgotPassword from './components/auth/ForgotPassword';


<Route path="/forgot-password" element={<ForgotPassword />} />

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email.');
    } catch (error) {
      toast.error(error.response.data.message || 'Error sending reset link');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
