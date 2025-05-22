// src/components/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserRow from './UserRow';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => <UserRow key={user.id} user={user} />)}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
