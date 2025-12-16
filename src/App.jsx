// App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute"; 
import { AuthProvider } from "./context/AuthContext";

import AppLayout from "./layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookSeatPage from "./pages/BookSeatPage";
import MeetingRooms from "./pages/MeetingRooms";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import MeetingRoomsConfig from './pages/admin/MeetingRoomsConfig';
import { initializeSampleData } from './utils/initData';
import FloorPlanManagement from "./pages/admin/FloorPlanManagement"; 

export default function App() {
  useEffect(() => {
    initializeSampleData();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes - No AppLayout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes with AppLayout (includes Navbar) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* These pages will render under the Navbar */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="book-seat" element={<BookSeatPage />} />
          <Route path="meeting-rooms" element={<MeetingRooms />} />
          <Route path="history" element={<History />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Admin Routes with AppLayout (includes Navbar) */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AppLayout />
            </AdminProtectedRoute>
          }
        >
          {/* These pages will render under the Navbar */}
          <Route path="meeting-rooms-config" element={<MeetingRoomsConfig />} />
          <Route path="floor-plan" element={<FloorPlanManagement />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}