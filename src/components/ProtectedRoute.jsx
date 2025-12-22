// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    
    // Also check sessionStorage as fallback
    const sessionUser = sessionStorage.getItem("userData");
    const isLoggedIn = isAuthenticated || sessionUser;
    
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}