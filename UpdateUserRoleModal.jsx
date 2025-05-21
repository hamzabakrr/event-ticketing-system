// src/components/admin/UpdateUserRoleModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UpdateUserRoleModal = ({ userId, currentRole, onClose, onUpdate }) => {
  const [role, setRole] = useState(currentRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${userId}`, { role });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="modal">
      <h3>Update User Role</h3>
      <form onSubmit={handleSubmit}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Organizer">Organizer</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Update Role</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateUserRoleModal;
