import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import OrganizerRoute from './components/common/OrganizerRoute';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';


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
    <>
      <ToastProvider />
      {/* Other components */}
    </>
  );
}
