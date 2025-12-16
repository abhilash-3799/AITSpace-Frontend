

import { useState, useEffect } from "react";
import { CheckCircle, Bell, Calendar, Mail, Clock } from "lucide-react";

export default function Notifications() {
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState([]);

 
  const defaultNotifications = [
    {
      id: 1,
      title: "Seat Booked Successfully",
      message: "Your seat S-12 on Floor 3 has been confirmed for today.",
      time: "2h ago",
      unread: true,
      iconType: "success",
      bg: "bg-blue-50",
      tag: "New",
    },
    {
      id: 2,
      title: "Queue Status Updated",
      message: "You are now #2 in the queue for Floor 3.",
      time: "Yesterday",
      unread: false,
      iconType: "bell",
      bg: "bg-white",
    },
    {
      id: 3,
      title: "Email Service Active",
      message: "Meeting room confirmations and reminders are now being sent via email.",
      time: "Just now",
      unread: true,
      iconType: "mail",
      bg: "bg-green-50",
      tag: "New",
    }
  ];

  // Load from localStorage safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem("notifications");
      setNotifications(saved ? JSON.parse(saved) : defaultNotifications);
    } catch {
      setNotifications(defaultNotifications);
    }
  }, []);

  // Listen for new notifications
  useEffect(() => {
    const handleNotificationAdded = () => {
      try {
        const updated = JSON.parse(localStorage.getItem("notifications")) || defaultNotifications;
        setNotifications(updated);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    window.addEventListener('notificationAdded', handleNotificationAdded);
    
    return () => {
      window.removeEventListener('notificationAdded', handleNotificationAdded);
    };
  }, []);

  // Icon renderer - UPDATED to include calendar icon for meetings
  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "bell":
        return <Bell size={20} className="text-blue-600" />;
      case "meeting":
        return <Calendar size={20} className="text-purple-600" />;
      case "mail":
        return <Mail size={20} className="text-green-600" />;
      case "reminder":
        return <Clock size={20} className="text-yellow-600" />;
      default:
        return <Bell size={20} className="text-blue-600" />;
    }
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id
        ? { ...n, unread: false, tag: undefined, bg: "bg-white" }
        : n
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({
      ...n,
      unread: false,
      tag: undefined,
      bg: "bg-white"
    }));
    
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const filtered =
    tab === "all"
      ? notifications
      : tab === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications.filter((n) => !n.unread);

  // Count statistics
  const unreadCount = notifications.filter(n => n.unread).length;
  const meetingNotifications = notifications.filter(n => n.type === "meeting").length;
  const reminderNotifications = notifications.filter(n => n.tag === "Reminder").length;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <p className="text-gray-600 mt-2">Stay updated with your bookings and reminders</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{notifications.length}</p>
            </div>
            <Bell className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold">{unreadCount}</p>
            </div>
            <Mail className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reminders</p>
              <p className="text-2xl font-bold">{reminderNotifications}</p>
            </div>
            <Clock className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-6 text-gray-700 font-medium">
          <button
            onClick={() => setTab("all")}
            className={`${tab === "all" ? "underline font-semibold" : ""}`}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => setTab("unread")}
            className={`${tab === "unread" ? "underline font-semibold" : ""}`}
          >
            Unread ({unreadCount})
          </button>

          <button
            onClick={() => setTab("read")}
            className={`${tab === "read" ? "underline font-semibold" : ""}`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="p-10 border rounded-xl text-center shadow-sm bg-white">
            <div className="bg-green-100 p-4 rounded-full mx-auto w-fit">
              <CheckCircle size={30} className="text-green-500" />
            </div>
            <h2 className="mt-3 text-xl font-semibold">No notifications!</h2>
            <p className="text-gray-600">You have no {tab} notifications</p>
          </div>
        )}

        {/* Notifications List */}
        {filtered.map((n) => (
          <div key={n.id} className={`p-5 rounded-xl border ${n.bg} shadow-sm`}>
            <div className="flex items-start gap-3">
              {renderIcon(n.iconType || n.type)}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{n.title}</h3>

                    {n.tag && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        n.tag === "New" ? "bg-blue-600 text-white" :
                        n.tag === "Reminder" ? "bg-yellow-600 text-white" :
                        "bg-gray-600 text-white"
                      }`}>
                        {n.tag}
                      </span>
                    )}
                  </div>
                  
                  {n.unread && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>

                <p className="text-gray-600 mt-1">{n.message}</p>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-400 text-sm">{n.time}</p>
                  
                  {n.unread && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}