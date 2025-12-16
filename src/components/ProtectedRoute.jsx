import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
