// import React from "react";
// import { X, Users, Calendar } from "lucide-react";

// export default function DailyScheduleModal({
//   isOpen,
//   onClose,
//   roomName = "Boardroom A",
//   date = "Thursday, November 27, 2025",
//   schedule = [],
//   onBookNow
// }) {
//   if (!isOpen) return null;

//   // Create schedule with all time slots available
//   const defaultTimeSlots = [
//     { time: "08:00", available: true, label: "" },
//     { time: "08:30", available: true, label: "" },
//     { time: "09:00", available: true, label: "" },
//     { time: "09:30", available: true, label: "" },
    
//     { time: "10:00", available: true, label: "" },
//     { time: "10:30", available: true, label: "" },
//     { time: "11:00", available: true, label: "" },
//     { time: "11:30", available: true, label: "" },
    
//     { time: "12:00", available: true, label: "" },
//     { time: "12:30", available: true, label: "" },
//     { time: "13:00", available: true, label: "" },
//     { time: "13:30", available: true, label: "" },
    
//     { time: "14:00", available: true, label: "" },
//     { time: "14:30", available: true, label: "" },
//     { time: "15:00", available: true, label: "" },
//     { time: "15:30", available: true, label: "" },
    
//     { time: "16:00", available: true, label: "" },
//     { time: "16:30", available: true, label: "" },
//     { time: "17:00", available: true, label: "" },
//     { time: "17:30", available: true, label: "" },
    
//     { time: "18:00", available: true, label: "" }
//   ];

//   // Add empty slots to make exactly 24 slots (6 rows x 4 columns)
//   while (defaultTimeSlots.length < 24) {
//     defaultTimeSlots.push({ time: "", available: true, label: "" });
//   }

//   // Use provided schedule or default
//   const displaySchedule = schedule.length > 0 ? schedule : defaultTimeSlots.slice(0, 24);

//   // Group schedule by availability
//   const availableSlots = displaySchedule.filter(slot => slot.available);
//   const bookedSlots = displaySchedule.filter(slot => !slot.available && slot.time !== "");

//   // Calculate available count - all slots are available
//   const availableCount = availableSlots.length;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-[560px] max-h-[90vh] overflow-y-auto">
//         {/* Header - Exact match to image */}
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Boardroom A - Daily Schedule</h2>
//             <div className="flex items-center gap-2 mt-2">
//               <Calendar size={14} className="text-gray-500" />
//               <span className="text-sm text-gray-600">{date}</span>
//             </div>
//           </div>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>


//         {/* Time Grid Section - All time slots in green color without green bar */}
//         <div className="mb-6">
//           <div className="grid grid-cols-4 gap-2 mb-3">
//             {displaySchedule.map((slot, i) => (
//               <div
//                 key={i}
//                 className={`relative py-2 px-1 rounded-lg text-center min-h-[50px] flex flex-col items-center justify-center ${
//                   slot.time === ""
//                     ? "bg-transparent"
//                     : "bg-green-100 border-2 border-green-400 hover:border-green-600 hover:shadow-sm cursor-pointer"
//                 } ${slot.time === "" ? "invisible" : ""}`}
//                 onClick={() => {
//                   if (slot.available) {
//                     onClose();
//                     if (onBookNow) onBookNow(slot.time);
//                   }
//                 }}
//               >
//                 <div className="text-sm font-medium text-gray-900">{slot.time}</div>
//                 {!slot.available && slot.label && (
//                   <div className="mt-1">
//                     <span className="text-xs font-medium text-red-800 px-2 py-1 bg-red-200 rounded">
//                       {slot.label}
//                     </span>
//                   </div>
//                 )}
//                 {slot.available && (
//                   <div className="mt-2">
                    
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Legend - Updated colors to darker green and red */}
//           <div className="flex items-center justify-center gap-6 text-sm">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
//               <span className="text-gray-700">Available</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
//               <span className="text-gray-700">Booked</span>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons - Exact colors from image */}
//         <div className="flex gap-3 pt-4 border-t">
//           <button
//             onClick={onClose}
//             className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
//           >
//             Close
//           </button>
//           <button 
//             className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
//             onClick={() => {
//               onClose();
//               if (onBookNow) onBookNow();
//             }}
//           >
//             Book This Room
//           </button>
//         </div>

        
//       </div>
//     </div>
//   );
// }

import React from "react";
import { X, Users, Calendar } from "lucide-react";

export default function DailyScheduleModal({
  isOpen,
  onClose,
  roomName = "Boardroom A",
  date = "Thursday, November 27, 2025",
  schedule = [],
  onBookNow
}) {
  if (!isOpen) return null;

  // Create schedule with all time slots available
  const defaultTimeSlots = [
    { time: "08:00", available: true, label: "" },
    { time: "08:30", available: true, label: "" },
    { time: "09:00", available: true, label: "" },
    { time: "09:30", available: true, label: "" },
    
    { time: "10:00", available: true, label: "" },
    { time: "10:30", available: true, label: "" },
    { time: "11:00", available: true, label: "" },
    { time: "11:30", available: true, label: "" },
    
    { time: "12:00", available: true, label: "" },
    { time: "12:30", available: true, label: "" },
    { time: "13:00", available: true, label: "" },
    { time: "13:30", available: true, label: "" },
    
    { time: "14:00", available: true, label: "" },
    { time: "14:30", available: true, label: "" },
    { time: "15:00", available: true, label: "" },
    { time: "15:30", available: true, label: "" },
    
    { time: "16:00", available: true, label: "" },
    { time: "16:30", available: true, label: "" },
    { time: "17:00", available: true, label: "" },
    { time: "17:30", available: true, label: "" },
    
    { time: "18:00", available: true, label: "" }
  ];

  // Add empty slots to make exactly 24 slots (6 rows x 4 columns)
  while (defaultTimeSlots.length < 24) {
    defaultTimeSlots.push({ time: "", available: true, label: "" });
  }

  // Use provided schedule or default
  const displaySchedule = schedule.length > 0 ? schedule : defaultTimeSlots.slice(0, 24);

  // Group schedule by availability
  const availableSlots = displaySchedule.filter(slot => slot.available);
  const bookedSlots = displaySchedule.filter(slot => !slot.available && slot.time !== "");

  // Calculate available count - all slots are available
  const availableCount = availableSlots.length;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[560px] max-h-[90vh] overflow-y-auto">
        {/* Header - Exact match to image */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Boardroom A - Daily Schedule</h2>
            <div className="flex items-center gap-2 mt-2">
              <Calendar size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">{date}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>


        {/* Time Grid Section - All time slots in green color without green bar */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {displaySchedule.map((slot, i) => (
              <div
                key={i}
                className={`relative py-2 px-1 rounded-lg text-center min-h-[50px] flex flex-col items-center justify-center ${
                  slot.time === ""
                    ? "bg-transparent"
                    : "bg-green-100 border-2 border-green-400 hover:border-green-600 hover:shadow-sm cursor-pointer"
                } ${slot.time === "" ? "invisible" : ""}`}
                onClick={() => {
                  if (slot.available && slot.time) {
                    onClose();
                    if (onBookNow) onBookNow(slot.time);
                  }
                }}
              >
                <div className="text-sm font-medium text-gray-900">{slot.time}</div>
                {!slot.available && slot.label && (
                  <div className="mt-1">
                    <span className="text-xs font-medium text-red-800 px-2 py-1 bg-red-200 rounded">
                      {slot.label}
                    </span>
                  </div>
                )}
                {slot.available && (
                  <div className="mt-2">
                    
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend - Updated colors to darker green and red */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
              <span className="text-gray-700">Booked</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Exact colors from image */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
          <button 
            className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
            onClick={() => {
              onClose();
              if (onBookNow) onBookNow();
            }}
          >
            Book This Room
          </button>
        </div>

        
      </div>
    </div>
  );
}
