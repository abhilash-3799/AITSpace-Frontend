
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const name = user?.name || "User";
  const initial = name.charAt(0).toUpperCase();
  
  // Check if user is admin
  const isAdmin = localStorage.getItem("role") === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Reusable NavLink styling
  const navItemClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition-all ${
      isActive
        ? "bg-gray-200 text-black font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <NavLink to="/dashboard" className="text-xl font-semibold">
          AITSpace
        </NavLink>

        <div className="flex gap-4">
          {/* Dashboard - Only for Admin */}
          {isAdmin && (
            <NavLink to="/dashboard" className={navItemClass}>
              Dashboard
            </NavLink>
          )}

          {/* Book Seat - Available for all users */}
          <NavLink to="/book-seat" className={navItemClass}>
            Book Seat
          </NavLink>

          {/* Meeting Rooms - Available for all users */}
          <NavLink to="/meeting-rooms" className={navItemClass}>
            Meeting Rooms
          </NavLink>

          {/* History - Only for Admin */}
          {isAdmin && (
            <NavLink to="/history" className={navItemClass}>
              History
            </NavLink>
          )}

          {/* Reports - Only for Admin */}
          {isAdmin && (
            <NavLink to="/reports" className={navItemClass}>
              Reports
            </NavLink>
          )}

          {/* Admin pages - Only for Admin */}
          {isAdmin && (
            <>
              <NavLink
                to="/admin/meeting-rooms-config"
                className={navItemClass}
              >
                Meeting Rooms Config
              </NavLink>

              <NavLink
                to="/admin/floor-plan"
                className={navItemClass}
              >
                Admin
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Bell Icon */}
        <Bell
          className="w-5 h-5 text-gray-700 cursor-pointer transition-all duration-200 
                     hover:text-blue-600 hover:scale-110"
          onClick={() => navigate("/notifications")}
        />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initial}
          </div>
          <span className="text-gray-700 font-medium">{name}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-700 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}