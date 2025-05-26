// src/components/shared/Navbar.jsx
<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderAuthLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Login
          </Link>
          <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            Register
          </Link>
        </>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center text-gray-300 hover:text-white focus:outline-none"
        >
          <span className="mr-2">{user.name}</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              {/* Common links for all authenticated users */}
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Profile
              </Link>

              {/* Organizer specific links */}
              {user.role === 'organizer' && (
                <>
                  <Link
                    to="/my-events"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    My Events
                  </Link>
                  <Link
                    to="/my-events/new"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Create Event
                  </Link>
                  <Link
                    to="/my-events/analytics"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Analytics
                  </Link>
                </>
              )}

              {/* Admin specific links */}
              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin/events"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Manage Events
                  </Link>
                  <Link
                    to="/admin/users"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
=======
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
>>>>>>> origin/main
                    Manage Users
                  </Link>
                </>
              )}
<<<<<<< HEAD

              {/* User specific links */}
              {user.role === 'user' && (
                <Link
                  to="/bookings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  My Bookings
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Event Ticketing
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Events
                </Link>
                {user?.role === 'organizer' && (
                  <Link
                    to="/my-events"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Events
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {renderAuthLinks()}
            </div>
=======
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
>>>>>>> origin/main
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
