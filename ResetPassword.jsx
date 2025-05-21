import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ResetPassword from './components/auth/ResetPassword';

// Inside your Routes component
<Route path="/reset-password/:token" element={<ResetPassword />} />

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      toast.success('Password has been reset successfully.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.message || 'Error resetting password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        name="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
