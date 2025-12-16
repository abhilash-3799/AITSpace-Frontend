import { useState, useEffect } from "react";
import { Filter, Calendar, Clock, Users, DoorOpen, MapPin } from "lucide-react";

export default function BookingHistory() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [tab, setTab] = useState("seat");

  const [seatBookings, setSeatBookings] = useState([]);
  const [meetingBookings, setMeetingBookings] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const seats = JSON.parse(localStorage.getItem("seatBookings")) || [];
    const meetings = JSON.parse(localStorage.getItem("meetingBookings")) || [];

    setSeatBookings(seats);
    setMeetingBookings(meetings);
  }, []);

  // ⭐ Add Notification Helper
  const addNotification = (newNotification) => {
    const existing = JSON.parse(localStorage.getItem("notifications")) || [];

    existing.unshift(newNotification); // add at top

    localStorage.setItem("notifications", JSON.stringify(existing));

    // notify Notifications.jsx
    window.dispatchEvent(new Event("notificationAdded"));
  };

  // Confirmation Popup
  const confirmCancel = () => {
    return window.confirm("Are you sure you want to cancel this booking?");
  };

  // Cancel Seat Booking
  const cancelSeatBooking = (id) => {
    if (!confirmCancel()) return;

    const updated = seatBookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );

    setSeatBookings(updated);
    localStorage.setItem("seatBookings", JSON.stringify(updated));

    // ⭐ Add Notification for seat cancellation
    const booking = seatBookings.find((s) => s.id === id);

    addNotification({
      id: Date.now(),
      title: "Seat Booking Cancelled",
      message: `Your seat ${booking.seatId} in ${booking.office} has been cancelled.`,
      time: "Just now",
      unread: true,
      iconType: "bell",
      tag: "New",
      bg: "bg-red-50",
    });
  };

  // Cancel Meeting Booking
  const cancelMeetingBooking = (id) => {
    if (!confirmCancel()) return;

    const updated = meetingBookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );

    setMeetingBookings(updated);
    localStorage.setItem("meetingBookings", JSON.stringify(updated));

    // ⭐ Meeting cancellation notification
    const booking = meetingBookings.find((m) => m.id === id);

    addNotification({
      id: Date.now(),
      title: "Meeting Cancelled",
      message: `Your meeting room ${booking.room} for ${booking.date} has been cancelled.`,
      time: "Just now",
      unread: true,
      iconType: "meeting",
      tag: "New",
      bg: "bg-red-50",
    });
  };

  // Sort Active → Completed → Cancelled
  const sortByStatus = (data) => {
    const statusOrder = { Active: 1, Completed: 2, Cancelled: 3 };

    return [...data].sort((a, b) => {
      return statusOrder[a.status] - statusOrder[b.status];
    });
  };

  const filterData = (data) => {
    let filtered = data;

    if (statusFilter !== "All") {
      filtered = data.filter((b) => b.status === statusFilter);
    }

    return sortByStatus(filtered);
  };

  const filteredSeats = filterData(seatBookings);
  const filteredMeetings = filterData(meetingBookings);

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-10 py-10">

      <h1 className="text-2xl font-semibold">Booking History</h1>
      <p className="text-gray-600 mb-8">View and manage all your bookings</p>

      {/* Status Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-600" />
          <span className="text-gray-700">Filter by status:</span>
        </div>

        <div className="flex gap-3">
          {["All", "Active", "Completed", "Cancelled"].map((btn) => (
            <button
              key={btn}
              onClick={() => setStatusFilter(btn)}
              className={`px-5 py-1.5 rounded-lg border text-sm 
              ${
                statusFilter === btn
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setTab("seat")}
          className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm border ${
            tab === "seat"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          <Calendar size={16} />
          Seat Bookings
          <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs text-gray-700">
            {seatBookings.length}
          </span>
        </button>

        <button
          onClick={() => setTab("meeting")}
          className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm border ${
            tab === "meeting"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          <Users size={16} />
          Meeting Rooms
          <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs text-gray-700">
            {meetingBookings.length}
          </span>
        </button>
      </div>

      {/* Seat Booking Table */}
      {tab === "seat" && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="py-3 px-6">Seat</th>
                <th className="py-3 px-6">Office</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeats.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No seat bookings found
                  </td>
                </tr>
              ) : (
                filteredSeats.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="py-5 px-6 font-medium">Seat {b.seatId}</td>

                    <td className="py-5 px-6 flex items-center gap-2">
                      <MapPin size={16} className="text-purple-600" />
                      {b.office}
                    </td>

                    <td className="py-5 px-6">{b.date}</td>

                    <td className="py-5 px-6">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          b.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-5 px-6 text-right">
                      {b.status === "Active" ? (
                        <button
                          onClick={() => cancelSeatBooking(b.id)}
                          className="px-4 py-1 text-sm bg-red-100 text-red-600 rounded-full border border-red-300 hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Meeting Booking Table */}
      {tab === "meeting" && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="py-3 px-6">Room</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Time</th>
                <th className="py-3 px-6">Attendees</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No meeting bookings found
                  </td>
                </tr>
              ) : (
                filteredMeetings.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="py-5 px-6 flex items-center gap-2">
                      <DoorOpen size={18} className="text-purple-600" />
                      {b.room}
                    </td>

                    <td className="py-5 px-6">{b.date}</td>

                    <td className="py-5 px-6 flex items-center gap-2">
                      <Clock size={16} />
                      {b.start} - {b.end}
                    </td>

                    <td className="py-5 px-6">{b.attendees} people</td>

                    <td className="py-5 px-6">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          b.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-5 px-6 text-right">
                      {b.status === "Active" ? (
                        <button
                          onClick={() => cancelMeetingBooking(b.id)}
                          className="px-4 py-1 text-sm bg-red-100 text-red-600 rounded-full border border-red-300 hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mt-10">
        <SummaryCard title="Total Seat Bookings" value={seatBookings.length} />
        <SummaryCard
          title="Active Seats"
          value={seatBookings.filter((s) => s.status === "Active").length}
          color="green"
        />
        <SummaryCard
          title="Total Meeting Bookings"
          value={meetingBookings.length}
        />
        <SummaryCard
          title="Active Meetings"
          value={meetingBookings.filter((m) => m.status === "Active").length}
          color="green"
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
      <p className="text-gray-700 text-sm">{title}</p>
      <h2
        className={`text-2xl font-semibold mt-2 ${
          color === "green" ? "text-green-600" : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}
