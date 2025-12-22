// components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get user data from context or sessionStorage
  const userData = user || JSON.parse(sessionStorage.getItem("userData")) || {};
  const name = userData.employeeName || userData.username || userData.email?.split('@')[0] || "User";
  const role = userData.role || "";
  const empNumber = userData.employeeNumber || "";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Reusable NavLink styling
  const navItemClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition-all ${isActive
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
          <NavLink to="/dashboard" className={navItemClass}>
            Dashboard
          </NavLink>

          <NavLink to="/book-seat" className={navItemClass}>
            Book Seat
          </NavLink>

          <NavLink to="/meeting-rooms" className={navItemClass}>
            Meeting Rooms
          </NavLink>

          <NavLink to="/history" className={navItemClass}>
            History
          </NavLink>

          <NavLink to="/reports" className={navItemClass}>
            Reports
          </NavLink>

          <NavLink to="/notifications" className={navItemClass}>
            Notifications
          </NavLink>

          {/* Admin links - check role from userData */}
          {role === "ADMIN" && (
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
                Floor Plan
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Bell Icon */}
        <button
          onClick={() => navigate("/notifications")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initial}
          </div>
          <div className="text-left">
            <span className="text-gray-700 font-medium block">{name}</span>
            {/* <span className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</span> */}
            <span className="text-xs text-gray-500 capitalize">{empNumber}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}