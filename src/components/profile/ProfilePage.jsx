import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuth from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', profile);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5">My Profile</Typography>
      <TextField
        label="Name"
        value={profile.name}
        onChange={(e) => setProfile({...profile, name: e.target.value})}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        type="email"
        value={profile.email}
        onChange={(e) => setProfile({...profile, email: e.target.value})}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained">
        Update Profile
      </Button>
    </Box>
  );
};
