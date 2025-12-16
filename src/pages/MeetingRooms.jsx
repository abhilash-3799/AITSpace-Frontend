
import { useState, useEffect } from "react";
import { Users, Tv, Wifi, Video, Projector, Clipboard, Clock, Building } from "lucide-react";
import BookRoomModal from "../components/BookNow";
import DailyScheduleModal from "../components/DailyScheduleModal";
import { requestNotificationPermission, initializeReminders } from "../utils/notificationService";

export default function EnhancedBookMeetingRoom() {
  const [attendees, setAttendees] = useState("2-4");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [selectedOffice, setSelectedOffice] = useState(null);
  const [offices, setOffices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleRoom, setScheduleRoom] = useState(null);

  
  useEffect(() => {
    const savedOffices = JSON.parse(localStorage.getItem("officeConfigs")) || [];
    setOffices(savedOffices);
    if (savedOffices.length > 0) {
      setSelectedOffice(savedOffices[0]);
    }
  }, []);

  
  useEffect(() => {
    
    requestNotificationPermission();
    
    
    initializeReminders();
    
   
    const interval = setInterval(() => {
      
      const now = new Date();
      const bookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
      
      bookings.forEach(booking => {
        if (booking.status === "Active" && !booking.reminderSent) {
          const bookingStart = new Date(`${booking.date}T${booking.start}`);
          const timeDiff = bookingStart.getTime() - now.getTime();
          
       
          if (timeDiff > 0 && timeDiff < 30 * 60 * 1000) {
            console.log("Meeting starting soon:", booking.room);
          }
        }
      });
    }, 60000); 
    
    return () => clearInterval(interval);
  }, []);

  
  const rooms = selectedOffice?.rooms?.filter(room => room.isActive) || [];

  const sampleSchedule = [
    { time: "08:00", available: true },
    { time: "08:30", available: true },
    { time: "09:00", available: false },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
    { time: "16:00", available: false },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true }
  ];

  const parseCapacity = (capacityText) => {
    const num = capacityText.match(/\d+/);
    return num ? Number(num[0]) : 0;
  };

  const getAttendeeRange = () => {
    const parts = attendees.split("-");
    if (parts.length === 2) return [Number(parts[0]), Number(parts[1])];
    return [Number(parts[0]), 999];
  };

  const [minAtt, maxAtt] = getAttendeeRange();

  const getTagIcon = (amenityId) => {
    if (amenityId.includes("tv")) return <Tv size={16} />;
    if (amenityId.includes("video")) return <Video size={16} />;
    if (amenityId.includes("wifi")) return <Wifi size={16} />;
    if (amenityId.includes("projector")) return <Projector size={16} />;
    if (amenityId.includes("whiteboard")) return <Clipboard size={16} />;
    return null;
  };

  const getAmenityName = (amenityId) => {
    const amenityNames = {
      tv: "TV Screen",
      video: "Video Conference",
      wifi: "WiFi",
      projector: "Projector",
      whiteboard: "Whiteboard",
      phone: "Conference Phone",
      camera: "Camera",
      ac: "Air Conditioning",
      coffee: "Coffee Machine"
    };
    return amenityNames[amenityId] || amenityId;
  };

  const formatDateForSchedule = (dateString) => {
    const dateObj = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  const handleClockClick = (room) => {
    setScheduleRoom(room);
    setShowSchedule(true);
  };

  const handleScheduleBookClick = (room) => {
    setShowSchedule(false);
    setSelectedRoom(room);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold">Book Meeting Room</h1>
        <p className="text-gray-600 mb-8">
          Reserve a meeting space with the right capacity and equipment
        </p>

        {offices.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Building className="text-gray-600" size={20} />
              <span className="text-gray-700 font-medium">Select Office:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {offices.map(office => (
                <button
                  key={office.id}
                  onClick={() => setSelectedOffice(office)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedOffice?.id === office.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {office.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-6 bg-white border border-gray-200 p-5 rounded-xl shadow-sm mb-8">
          <div className="flex items-center gap-2">
            <Users className="text-gray-600" size={18} />
            <span className="text-gray-700">Attendees:</span>
            <select
              className="border px-3 py-1 rounded-lg"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            >
              <option value="1-2">1-2 people</option>
              <option value="2-4">2-4 people</option>
              <option value="4-8">4-8 people</option>
              <option value="8-12">8-12 people</option>
              <option value="13-20">13+ people</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700">Date:</span>
            <input
              type="date"
              className="border px-3 py-1 rounded-lg"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {selectedOffice && (
            <div className="ml-auto text-sm text-gray-600">
              <span className="font-medium">{rooms.length}</span> rooms available
              {selectedOffice.floors > 1 && ` across ${selectedOffice.floors} floors`}
            </div>
          )}
        </div>

        {/* Rooms Grid */}
        {selectedOffice ? (
          rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, i) => {
                const capacity = parseCapacity(room.capacity);
                const exceeds = capacity < minAtt;

                return (
                  <div
                    key={i}
                    className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <h2 className="font-semibold text-lg">{room.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                          Floor {room.floor}
                        </span>
                        {!room.isActive && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="flex items-center gap-1 text-gray-600 mt-1 text-sm">
                      <Users size={16} /> {room.capacity}
                    </p>

                    <p className="text-gray-700 text-sm mt-3">{room.description}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {room.amenities?.slice(0, 4).map((amenityId, j) => (
                        <span
                          key={j}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                        >
                          {getTagIcon(amenityId)} {getAmenityName(amenityId)}
                        </span>
                      ))}
                      {room.amenities?.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    <p className="text-sm mt-5 text-gray-600">Today's Availability</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${room.availability}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-600">
                      {room.availability}%
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        className={`w-full py-2 rounded-lg font-medium ${
                          exceeds || !room.isActive
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        disabled={exceeds || !room.isActive}
                        onClick={() => {
                          if (!exceeds && room.isActive) {
                            setSelectedRoom(room);
                            setShowModal(true);
                          }
                        }}
                      >
                        {room.isActive ? "Book Now" : "Room Unavailable"}
                      </button>

                      <button
                        className="p-2 border rounded-lg hover:bg-gray-100"
                        onClick={() => handleClockClick(room)}
                      >
                        <Clock size={20} className="text-gray-600" />
                      </button>
                    </div>

                    {exceeds && (
                      <p className="text-red-600 text-sm mt-2">
                        Room capacity exceeded
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Building size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Rooms Available
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedOffice.name} doesn't have any meeting rooms configured yet.
              </p>
              <p className="text-sm text-gray-500">
                Contact your administrator to set up meeting rooms for this office.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Building size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Office Configured
            </h3>
            <p className="text-gray-600">
              Please set up an office first to book meeting rooms.
            </p>
          </div>
        )}

        {/* Modals */}
        {showModal && selectedRoom && (
          <BookRoomModal
            room={selectedRoom}
            onClose={() => setShowModal(false)}
          />
        )}

        {showSchedule && scheduleRoom && (
          <DailyScheduleModal
            isOpen={showSchedule}
            onClose={() => setShowSchedule(false)}
            roomName={scheduleRoom.name}
            date={formatDateForSchedule(date)}
            schedule={sampleSchedule}
            onBookNow={() => handleScheduleBookClick(scheduleRoom)}
          />
        )}
      </div>
    </div>
  );
}