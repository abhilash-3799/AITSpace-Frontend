// components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (userRole !== "ADMIN") {
    // You can redirect to dashboard or show unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}