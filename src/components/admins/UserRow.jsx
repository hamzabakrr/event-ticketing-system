// src/components/admin/UserRow.jsx
import React from 'react';

const UserRow = ({ user }) => {
  const handleDelete = () => {
    // Implement delete functionality
  };

  const handleRoleChange = () => {
    // Implement role change functionality
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button onClick={handleRoleChange}>Change Role</button>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
