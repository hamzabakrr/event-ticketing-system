// src/components/profile/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/users/me')
      .then(response => setUser(response.data))
      .catch(error => console.error(error));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
};

export default ProfilePage;
