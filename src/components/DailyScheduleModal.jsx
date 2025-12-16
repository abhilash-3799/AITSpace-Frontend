
import React from "react";
import { X, Users, Tv, Wifi, Video, Projector, Clipboard, Clock, Calendar } from "lucide-react";

export default function DailyScheduleModal({
  isOpen,
  onClose,
  roomName = "Boardroom A",
  date = "Monday, December 1, 2025",
  schedule = [],
  onBookNow
}) {
  if (!isOpen) return null;

  const getTagIcon = (tag) => {
    if (tag.includes("TV") || tag.includes("tv")) return <Tv size={12} />;
    if (tag.includes("Video") || tag.includes("video")) return <Video size={12} />;
    if (tag.includes("WiFi") || tag.includes("wifi")) return <Wifi size={12} />;
    if (tag.includes("Projector") || tag.includes("projector")) return <Projector size={12} />;
    if (tag.includes("Whiteboard") || tag.includes("whiteboard")) return <Clipboard size={12} />;
    return null;
  };

  // Mock room details - in real app, pass as prop
  const roomDetails = {
    name: roomName,
    capacity: "Up to 12 people",
    tags: ["Video Conference", "Projector", "Whiteboard", "WiFi"],
    floor: "3",
    description: "Large boardroom perfect for executive meetings and presentations"
  };

  // Group schedule by availability
  const availableSlots = schedule.filter(slot => slot.available);
  const bookedSlots = schedule.filter(slot => !slot.available);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-5 w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {roomName}
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                Floor {roomDetails.floor}
              </span>
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Users size={14} /> {roomDetails.capacity}
            </p>
            <p className="text-sm text-gray-500 mt-1">{roomDetails.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {roomDetails.tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
            >
              {getTagIcon(tag)} {tag}
            </span>
          ))}
        </div>

        {/* Date Header */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-600" />
            <div>
              <h3 className="font-medium">Daily Schedule</h3>
              <p className="text-sm text-gray-600">{date}</p>
            </div>
          </div>
        </div>

        {/* Availability Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-green-700">Available Slots</p>
            <p className="text-2xl font-bold text-green-800">{availableSlots.length}</p>
            <p className="text-xs text-green-600">out of {schedule.length} total</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-red-700">Booked Slots</p>
            <p className="text-2xl font-bold text-red-800">{bookedSlots.length}</p>
            <p className="text-xs text-red-600">Currently occupied</p>
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Time Slots (30 min intervals)</p>
          <div className="grid grid-cols-4 gap-2">
            {schedule.map((slot, i) => (
              <div
                key={i}
                className={`py-2 px-1 rounded text-center text-sm ${
                  slot.available
                    ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                    : "bg-red-100 text-red-700"
                }`}
                title={slot.available ? "Click to book this slot" : "Already booked"}
                onClick={() => {
                  if (slot.available) {
                    // In a real app, you might pass the selected time to booking
                    onClose();
                    if (onBookNow) onBookNow();
                  }
                }}
              >
                {slot.time}
                {slot.available && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="text-xs text-gray-500 ml-auto">
            Click on available slots to book
          </div>
        </div>

        {/* Reminder Notice */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⏰ <strong>Reminder Service:</strong> Bookings include automatic 30-minute reminders and email confirmations.
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Close
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            onClick={() => {
              onClose();
              if (onBookNow) onBookNow();
            }}
          >
            <Calendar size={16} />
            Book This Room
          </button>
        </div>
      </div>
    </div>
  );
}