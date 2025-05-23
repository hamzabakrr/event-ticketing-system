import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import PrivateRoute from "./components/shared/PrivateRoute";
import RoleBasedRoute from "./components/shared/RoleBasedRoute";

import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPassword from "./components/auth/ForgotPassword";

import ProfilePage from "./components/profile/ProfilePage";
import UpdateProfileForm from "./components/profile/UpdateProfileForm";

import EventList from "./components/events/EventList";
import EventDetails from "./components/events/EventDetails";
import BookTicketForm from "./components/bookings/BookTicketForm";
import UserBookingsPage from "./components/bookings/UserBookingsPage";
import BookingDetails from "./components/bookings/BookingDetails";

import MyEventsPage from "./components/organizer/MyEventsPage";
import EventForm from "./components/organizer/EventForm";
import EventAnalytics from "./components/organizer/EventAnalytics";

import AdminEventsPage from "./components/admin/AdminEventsPage";
import AdminUsersPage from "./components/admin/AdminUsersPage";

import UnauthorizedPage from "./components/shared/UnauthorizedPage";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route element={<OrganizerRoute />}>
              <Route path="/my-events" element={<MyEventsPage />} />
              <Route path="/events/new" element={<EventForm />} />
              <Route path="/events/:id/edit" element={<EventForm />} />
            </Route>
            
            <Route element={<AdminRoute />}>
              <Route path="/admin/events" element={<AdminEventsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
import ToastProvider from './components/shared/ToastProvider';


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<EventList />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Authenticated User Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <RoleBasedRoute allowedRoles={["User"]}>
              <UserBookingsPage />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <RoleBasedRoute allowedRoles={["User"]}>
              <BookingDetails />
            </RoleBasedRoute>
          }
        />

        {/* Organizer Routes */}
        <Route
          path="/my-events"
          element={
            <RoleBasedRoute allowedRoles={["Organizer"]}>
              <MyEventsPage />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/my-events/new"
          element={
            <RoleBasedRoute allowedRoles={["Organizer"]}>
              <EventForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/my-events/:id/edit"
          element={
            <RoleBasedRoute allowedRoles={["Organizer"]}>
              <EventForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/my-events/analytics"
          element={
            <RoleBasedRoute allowedRoles={["Organizer"]}>
              <EventAnalytics />
            </RoleBasedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/events"
          element={
            <RoleBasedRoute allowedRoles={["Admin"]}>
              <AdminEventsPage />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleBasedRoute allowedRoles={["Admin"]}>
              <AdminUsersPage />
            </RoleBasedRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

function App() {
  return (
    <>
      <ToastProvider />
      {/* Other components */}
    </>
  );
}
