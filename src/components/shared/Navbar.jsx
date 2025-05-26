// src/components/shared/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Event Ticketing</span>
            </Link>
            <div className="hidden md:flex md:items-center md:ml-6 space-x-4">
              <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                Events
              </Link>
              {user && (
                <Link to="/bookings" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                  My Bookings
                </Link>
              )}
              {user?.role === 'Organizer' && (
                <Link to="/organizer/events" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                  Manage Events
                </Link>
              )}
              {user?.role === 'Admin' && (
                <>
                  <Link to="/admin/events" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                    Admin Events
                  </Link>
                  <Link to="/admin/users" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                    Manage Users
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
