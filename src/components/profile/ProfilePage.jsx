import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
            {user?.name || 'N/A'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
            {user?.email || 'N/A'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
            {user?.role || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
