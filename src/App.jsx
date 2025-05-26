import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Shared Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UnauthorizedPage from './pages/UnauthorizedPage';

// User Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import EventDetails from './pages/EventDetails';
import UserBookings from './pages/UserBookings';

// Organizer Pages
import MyEvents from './pages/organizer/MyEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/organizer/EditEvent';
import EventAnalytics from './pages/organizer/EventAnalytics';

// Admin Pages
import AdminEvents from './pages/admin/AdminEvents';
import AdminUsers from './pages/admin/AdminUsers';

// Context Provider
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/events/:id" element={<EventDetails />} />

              {/* Protected Routes - All Authenticated Users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Standard Users */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserBookings />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Organizers */}
              <Route
                path="/my-events"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/new"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/analytics"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <EventAnalytics />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
