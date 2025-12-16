import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute"; 

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
    <Routes>

      
      <Route path="/" element={<LoginPage />} />

      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="book-seat" element={<BookSeatPage />} />
        <Route path="meeting-rooms" element={<MeetingRooms />} />
        <Route path="history" element={<History />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AppLayout />  
          </AdminProtectedRoute>
        }
      >
        
        <Route path="meeting-rooms-config" element={<MeetingRoomsConfig />} />
        <Route path="floor-plan" element={<FloorPlanManagement />} />
      </Route>

    </Routes>
  );
}
