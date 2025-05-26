import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          Sorry, you don't have permission to access this page.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Go Home
          </Link>
          <Link
            to="/login"
            className="inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 