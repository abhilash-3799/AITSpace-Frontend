// components/EmailReminderStatus.js
import { useState, useEffect } from "react";
import { Mail, Bell, Calendar, CheckCircle, Clock } from "lucide-react";

export default function EmailReminderStatus() {
  const [emailLogs, setEmailLogs] = useState([]);
  const [scheduledReminders, setScheduledReminders] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      try {
        const logs = JSON.parse(localStorage.getItem("emailLogs")) || [];
        const reminders = JSON.parse(localStorage.getItem("scheduledReminders")) || [];
        const meetingBookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
        
        setEmailLogs(logs);
        setScheduledReminders(reminders);
        setBookings(meetingBookings);
      } catch (error) {
        console.error("Failed to load status data:", error);
      }
    };

    loadData();
    
    // Listen for updates
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const upcomingReminders = scheduledReminders.filter(r => !r.triggered);
  const sentEmails = emailLogs.length;
  const upcomingMeetings = bookings.filter(b => {
    const meetingTime = new Date(`${b.date}T${b.start}`);
    return meetingTime > new Date();
  }).length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Bell size={20} className="text-blue-600" />
        Notification & Reminder Status
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emails Sent</p>
              <p className="text-2xl font-bold">{sentEmails}</p>
            </div>
            <Mail className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Reminders</p>
              <p className="text-2xl font-bold">{upcomingReminders.length}</p>
            </div>
            <Clock className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Meetings</p>
              <p className="text-2xl font-bold">{upcomingMeetings}</p>
            </div>
            <Calendar className="text-purple-500" size={24} />
          </div>
        </div>
      </div>
      
      {emailLogs.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Recent Email Confirmations</h4>
          <div className="space-y-2">
            {emailLogs.slice(0, 3).map((log, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={16} className="text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.subject}</p>
                  <p className="text-xs text-gray-500">To: {log.to}</p>
                </div>
                <span className="text-xs text-gray-400">{log.sentAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}