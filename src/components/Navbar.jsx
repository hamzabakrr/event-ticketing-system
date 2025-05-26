import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Egyptian Events
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200">
              Events
            </Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200">
                    Admin Dashboard
                  </Link>
                )}
                
                {user.role === 'organizer' && (
                  <Link to="/organizer" className="hover:text-blue-200">
                    Organizer Dashboard
                  </Link>
                )}

                <Link to="/bookings" className="hover:text-blue-200">
                  My Bookings
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 