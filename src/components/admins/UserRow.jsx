import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import UpdateUserRoleModal from './UpdateUserRoleModal';

const UserRow = ({ user, onUserUpdated, onUserDeleted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateRole = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${user._id}`);
      toast.success(`User ${user.name} deleted successfully`);
      onUserDeleted(user._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRoleUpdated = (updatedUser) => {
    onUserUpdated(updatedUser);
    setIsModalOpen(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="py-3 px-4 border">{user.name}</td>
        <td className="py-3 px-4 border">{user.email}</td>
        <td className="py-3 px-4 border capitalize">
          <span className={`px-2 py-1 rounded-full text-xs ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
            user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {user.role}
          </span>
        </td>
        <td className="py-3 px-4 border">
          <div className="flex space-x-2">
            <button
              onClick={handleUpdateRole}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={isDeleting}
            >
              Update Role
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </td>
      </tr>

      {isModalOpen && (
        <UpdateUserRoleModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </>
  );
};

export default UserRow;
