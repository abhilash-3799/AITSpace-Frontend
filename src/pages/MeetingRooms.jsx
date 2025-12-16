// import { useState, useEffect } from "react";
// import { Users, Tv, Wifi, Video, Projector, Clipboard, Clock, Building } from "lucide-react";
// import BookRoomModal from "../components/BookNow";
// import DailyScheduleModal from "../components/DailyScheduleModal";
// import { requestNotificationPermission, initializeReminders } from "../utils/notificationService";
// import { fetchWorkspaces, fetchRoomsByWorkspace } from "../services/workspaceApi";

// export default function EnhancedBookMeetingRoom() {
//   const [date] = useState(new Date().toISOString().split("T")[0]);
//   const [offices, setOffices] = useState([]);
//   const [selectedOffice, setSelectedOffice] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [showSchedule, setShowSchedule] = useState(false);
//   const [scheduleRoom, setScheduleRoom] = useState(null);
//   const [roomAvailabilities, setRoomAvailabilities] = useState({});

//   /* ------------------- LOAD WORKSPACES ------------------- */
//   useEffect(() => {
//     fetchWorkspaces()
//       .then(data => {
//         setOffices(data);
//         if (data.length > 0) setSelectedOffice(data[0]);
//       })
//       .catch(console.error);
//   }, []);

//   /* ------------------- LOAD ROOMS BY WORKSPACE ------------------- */
//   useEffect(() => {
//     if (!selectedOffice) return;

//     fetchRoomsByWorkspace(selectedOffice.id)
//       .then(data => setRooms(data))
//       .catch(console.error);
//   }, [selectedOffice]);

//   /* ------------------- NOTIFICATIONS ------------------- */
//   useEffect(() => {
//     requestNotificationPermission();
//     initializeReminders();
//   }, []);

//   /* ------------------- AVAILABILITY CALC ------------------- */
//   useEffect(() => {
//     const calculate = room => {
//       const bookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
//       const today = new Date().toISOString().split("T")[0];

//       const todays = bookings.filter(
//         b => b.date === today && b.room === room.name
//       );

//       let booked = 0;
//       todays.forEach(b => {
//         const [sh, sm] = b.start.split(":").map(Number);
//         const [eh, em] = b.end.split(":").map(Number);
//         booked += (eh * 60 + em) - (sh * 60 + sm);
//       });

//       return Math.min(Math.round((booked / 1440) * 100), 100);
//     };

//     const map = {};
//     rooms.forEach(r => map[r.name] = calculate(r));
//     setRoomAvailabilities(map);
//   }, [rooms]);

//   const sampleSchedule = [
//     { time: "08:00", available: true },
//     { time: "09:00", available: false },
//     { time: "10:00", available: true },
//     { time: "11:00", available: true },
//   ];

//   const getAvailabilityColor = p =>
//     p < 30 ? "bg-green-400" : p < 60 ? "bg-yellow-400" : "bg-red-500";

//   return (
//     <div className="min-h-screen bg-[#F6F7FB] px-10 py-10">
//       <h1 className="text-2xl font-semibold mb-4">Book Meeting Room</h1>

//       {/* Offices */}
//       <div className="flex gap-2 mb-6">
//         {offices.map(o => (
//           <button
//             key={o.id}
//             onClick={() => setSelectedOffice(o)}
//             className={`px-4 py-2 rounded-lg ${
//               selectedOffice?.id === o.id
//                 ? "bg-blue-600 text-white"
//                 : "bg-white border"
//             }`}
//           >
//             {o.name}
//           </button>
//         ))}
//       </div>

//       {/* Rooms */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {rooms.map(room => {
//           const booked = roomAvailabilities[room.name] || 0;
//           return (
//             <div key={room.id} className="bg-white p-5 rounded-xl shadow">
//               <h2 className="font-semibold">{room.name}</h2>
//               <p className="text-sm text-gray-600">Floor {room.floor}</p>

//               <div className="mt-2 flex items-center gap-2 text-sm">
//                 <Users size={14} /> {room.capacity}
//               </div>

//               <p className="text-sm mt-2">{room.description}</p>

//               <div className="mt-3 flex gap-2 flex-wrap">
//                 {room.amenities?.map((a, i) => (
//                   <span key={i} className="text-xs bg-blue-50 px-2 py-1 rounded">
//                     {a}
//                   </span>
//                 ))}
//               </div>

//               <div className="mt-4">
//                 <div className="w-full bg-gray-200 h-2 rounded">
//                   <div
//                     className={`${getAvailabilityColor(booked)} h-2 rounded`}
//                     style={{ width: `${booked}%` }}
//                   />
//                 </div>
//                 <p className="text-xs mt-1">{100 - booked}% available</p>
//               </div>

//               <div className="flex gap-2 mt-4">
//                 <button
//                   className="flex-1 bg-blue-600 text-white py-2 rounded"
//                   onClick={() => {
//                     setSelectedRoom(room);
//                     setShowModal(true);
//                   }}
//                 >
//                   Book Now
//                 </button>
//                 <button
//                   className="border p-2 rounded"
//                   onClick={() => {
//                     setScheduleRoom(room);
//                     setShowSchedule(true);
//                   }}
//                 >
//                   <Clock size={18} />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {showModal && (
//         <BookRoomModal
//           room={selectedRoom}
//           onClose={() => setShowModal(false)}
//         />
//       )}

//       {showSchedule && (
//         <DailyScheduleModal
//           isOpen
//           roomName={scheduleRoom.name}
//           date={date}
//           schedule={sampleSchedule}
//           onClose={() => setShowSchedule(false)}
//         />
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Users, Tv, Wifi, Video, Projector, Clipboard, Clock, Building } from "lucide-react";
import BookRoomModal from "../components/BookNow";
import DailyScheduleModal from "../components/DailyScheduleModal";
import { requestNotificationPermission, initializeReminders } from "../utils/notificationService";
import { fetchWorkspaces, fetchRoomsByWorkspace } from "../services/workspaceApi";

export default function EnhancedBookMeetingRoom() {
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleRoom, setScheduleRoom] = useState(null);
  const [roomAvailabilities, setRoomAvailabilities] = useState({});

  /* ------------------- LOAD WORKSPACES ------------------- */
  useEffect(() => {
    fetchWorkspaces()
      .then(data => {
        setOffices(data);
        if (data.length > 0) setSelectedOffice(data[0]);
      })
      .catch(console.error);
  }, []);

  /* ------------------- LOAD ROOMS BY WORKSPACE ------------------- */
  useEffect(() => {
    if (!selectedOffice) return;

    fetchRoomsByWorkspace(selectedOffice.id)
      .then(data => setRooms(data))
      .catch(console.error);
  }, [selectedOffice]);

  /* ------------------- NOTIFICATIONS ------------------- */
  useEffect(() => {
    requestNotificationPermission();
    initializeReminders();
  }, []);

  /* ------------------- AVAILABILITY CALC ------------------- */
  useEffect(() => {
    const calculate = room => {
      const bookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
      const today = new Date().toISOString().split("T")[0];

      const todays = bookings.filter(
        b => b.date === today && b.room === room.name
      );

      let booked = 0;
      todays.forEach(b => {
        const [sh, sm] = b.start.split(":").map(Number);
        const [eh, em] = b.end.split(":").map(Number);
        booked += (eh * 60 + em) - (sh * 60 + sm);
      });

      return Math.min(Math.round((booked / 1440) * 100), 100);
    };

    const map = {};
    rooms.forEach(r => map[r.name] = calculate(r));
    setRoomAvailabilities(map);
  }, [rooms]);

  const sampleSchedule = [
    { time: "08:00", available: true },
    { time: "09:00", available: false },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
  ];

  const getAvailabilityColor = p =>
    p < 30 ? "bg-green-400" : p < 60 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-10 py-10">
      <h1 className="text-2xl font-semibold mb-4">Book Meeting Room</h1>

      {/* Offices */}
      <div className="flex gap-2 mb-6">
        {offices.map(o => (
          <button
            key={o.id}
            onClick={() => setSelectedOffice(o)}
            className={`px-4 py-2 rounded-lg ${
              selectedOffice?.id === o.id
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {o.name}
          </button>
        ))}
      </div>

      {/* Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map(room => {
          const booked = roomAvailabilities[room.name] || 0;
          return (
            <div key={room.id} className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold">{room.name}</h2>
              <p className="text-sm text-gray-600">Floor {room.floor}</p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <Users size={14} /> {room.capacity}
              </div>

              <p className="text-sm mt-2">{room.description}</p>

              <div className="mt-3 flex gap-2 flex-wrap">
                {room.amenities?.map((a, i) => (
                  <span key={i} className="text-xs bg-blue-50 px-2 py-1 rounded">
                    {a}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className={`${getAvailabilityColor(booked)} h-2 rounded`}
                    style={{ width: `${booked}%` }}
                  />
                </div>
                <p className="text-xs mt-1">{100 - booked}% available</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowModal(true);
                  }}
                >
                  Book Now
                </button>
                <button
                  className="border p-2 rounded"
                  onClick={() => {
                    setScheduleRoom(room);
                    setShowSchedule(true);
                  }}
                >
                  <Clock size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <BookRoomModal
          room={selectedRoom}
          onClose={() => setShowModal(false)}
        />
      )}

      {showSchedule && (
        <DailyScheduleModal
          isOpen={showSchedule}
          roomName={scheduleRoom?.name}
          date={date}
          schedule={sampleSchedule}
          onClose={() => setShowSchedule(false)}
          onBookNow={() => {
            setShowSchedule(false);
            setSelectedRoom(scheduleRoom);
            setShowModal(true);
          }}
        />
      )}
    </div>
  );
}