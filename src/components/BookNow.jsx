import { useState, useEffect } from "react";
import { 
  X, Users, Tv, Wifi, Video, Projector, Clipboard, 
  Mail, Clock, CheckCircle, AlertCircle, Loader,
  ChevronLeft, ChevronRight, Calendar
} from "lucide-react";
import { sendEmailNotification, scheduleReminder } from "../utils/notificationService";
import { bookNowAPI } from "../services/bookNowAPI";

export default function EnhancedBookRoomModal({ room, onClose }) {
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes();
    const roundedMinutes = minutes < 30 ? '00' : '30';
    return `${hours}:${roundedMinutes}`;
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [startTime, setStartTime] = useState(getCurrentTimeSlot());
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [bookingStep, setBookingStep] = useState("form");
  const [emailMethod, setEmailMethod] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [bookingIdString, setBookingIdString] = useState(null);
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [filteredStartTimeOptions, setFilteredStartTimeOptions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state

  // Get user data from sessionStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
      setEmployeeId(userData.employeeId || "");
      setUserEmail(userData.email || "");
    }
  }, []);

  const getTagIcon = (amenityId) => {
    if (amenityId.includes("tv")) return <Tv size={14} />;
    if (amenityId.includes("video")) return <Video size={14} />;
    if (amenityId.includes("wifi")) return <Wifi size={14} />;
    if (amenityId.includes("projector")) return <Projector size={14} />;
    if (amenityId.includes("whiteboard")) return <Clipboard size={14} />;
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

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(dateString);
    return dateToCheck < today;
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (isToday(selectedDate)) {
      const currentTime = getCurrentTime();
      const filteredTimes = timeOptions.filter(time => time >= currentTime);
      setFilteredStartTimeOptions(filteredTimes);
      if (startTime < currentTime) {
        setStartTime(filteredTimes[0] || getCurrentTimeSlot());
      }
    } else {
      setFilteredStartTimeOptions(timeOptions);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (startTime) {
      const filteredEndTimes = timeOptions.filter(time => time > startTime);
      setEndTimeOptions(filteredEndTimes);
      if (endTime && endTime <= startTime) {
        setEndTime("");
      }
    } else {
      setEndTimeOptions(timeOptions);
      setEndTime("");
    }
  }, [startTime, endTime, timeOptions]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const addMeetingNotification = (bookingData, emailResult) => {
    try {
      const existingNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
      const newNotification = {
        id: Date.now(),
        title: "Meeting Room Booked Successfully",
        message: `Your meeting in ${bookingData.room} has been confirmed for ${bookingData.date} at ${bookingData.start}. ${emailResult.method === 'EmailJS' ? 'Email sent!' : 'Email sent in demo mode.'}`,
        time: "Just now",
        unread: true,
        iconType: "success",
        bg: "bg-blue-50",
        tag: "New",
        type: "meeting"
      };
      const updatedNotifications = [newNotification, ...existingNotifications];
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      window.dispatchEvent(new CustomEvent('notificationAdded'));
    } catch (error) {
      console.error("Failed to save notification:", error);
    }
  };

  const handleConfirm = async () => {
    // Clear any previous error messages
    setErrorMessage("");

    // Validation for employeeId and userEmail
    if (!employeeId) {
      alert("Employee ID not found. Please login again.");
      return;
    }
    
    if (!userEmail) {
      alert("User email not found. Please login again.");
      return;
    }

    if (!startTime || !endTime || !selectedDate) {
      alert("Please fill all required fields.");
      return;
    }

    if (isPastDate(selectedDate)) {
      alert("Cannot book a room for a past date.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const backendBookingData = {
      employeeId: employeeId, // Get from sessionStorage
      roomName: room.name,
      floor: room.floor,
      capacity: room.capacity,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      amenities: room.amenities || [],
      officeName: room.officeName,
      attendees: attendees,
      email: userEmail, // Get from sessionStorage
      type: "meeting"
    };

    // Temporary local booking object
    const newBooking = {
      id: Date.now(),
      bookingId: null,  
      bookingIdString: null,
      type: "meeting",
      room: room.name,
      floor: room.floor,
      capacity: room.capacity,
      date: selectedDate,
      start: startTime,
      end: endTime,
      amenities: room.amenities || [],
      status: "Active",
      office: room.officeName,
      reminderSent: false,
      bookedAt: new Date().toLocaleString()
    };

    setBookingId(newBooking.id);
    setBookingStep("processing");

    try {
      let backendResponse;
      try {
        backendResponse = await bookNowAPI.bookMeetingRoom(backendBookingData);
        console.log("✅ Backend booking saved:", backendResponse);
        
        if (backendResponse?.bookingIdString) {
          newBooking.bookingIdString = backendResponse.bookingIdString;
          setBookingIdString(backendResponse.bookingIdString);
        }
        if (backendResponse?.bookingId) {
          newBooking.bookingId = backendResponse.bookingId;
        }
      } catch (backendError) {
        console.error("Backend booking failed:", backendError);
        
        // Extract error message from backend
        if (backendError.message && backendError.message.includes("Room is already booked")) {
          setErrorMessage("Room is already booked for the selected time slot. Please choose a different time.");
        } else {
          setErrorMessage(backendError.message || "Booking failed. Please try again.");
        }
        
        // If backend fails, don't continue with local storage
        setBookingStep("error");
        return;
      }

      const allBookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
      allBookings.push(newBooking);
      localStorage.setItem("meetingBookings", JSON.stringify(allBookings));

      let emailResult;
      try {
        emailResult = await sendEmailNotification(newBooking);
        setEmailMethod(emailResult.method || "Unknown");
        if (emailResult.simulated) {
          console.log("📧 Email sent in demo mode");
        }
      } catch (emailError) {
        console.warn("Email failed, continuing with booking:", emailError);
        emailResult = { success: false, method: "Failed", simulated: true };
      }

      addMeetingNotification(newBooking, emailResult);

      try {
        scheduleReminder(newBooking);
        console.log("⏰ Reminder scheduled");
      } catch (reminderError) {
        console.warn("Failed to schedule reminder:", reminderError);
      }

      setBookingStep("success");
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error("Booking failed:", error);
      setBookingStep("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const formatMonthYear = (date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const formatDateDisplay = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '/');
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(year, month, day));
      const isSelected = dateStr === selectedDate;
      const isTodayDate = dateStr === formatDate(new Date());
      const isPast = isPastDate(dateStr);
      
      days.push(
        <button
          key={day}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isSelected ? 'bg-blue-600 text-white' : ''}
            ${!isSelected && !isPast ? 'hover:bg-gray-100' : ''}
            ${isTodayDate && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}
          `}
          onClick={() => { if (!isPast) setSelectedDate(dateStr); }}
          disabled={isPast}
        >
          {day}
        </button>
      );
    }
    
    return (
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
          <div className="font-semibold">{formatMonthYear(currentMonth)}</div>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => <div key={day} className="text-center text-xs font-medium text-gray-500 h-6 flex items-center justify-center">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
        <div className="mt-4 pt-3 border-t text-sm"><div className="text-gray-600">Selected: {formatDateDisplay(selectedDate)}</div></div>
      </div>
    );
  };

  const renderForm = () => (
    <>
      <h2 className="text-lg font-semibold mb-4">{`Book ${room.name}`}</h2>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Room Details Section */}
      <div className="border rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Room</div>
            <div className="font-semibold">{room.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Floor</div>
            <div className="font-semibold">{room.floor}</div>
          </div>
        </div>

        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-3">Available</div>
      </div>

      {/* Calendar Section */}
      <div className="mb-4">
        <div className="font-medium text-sm mb-2">Select Date</div>
        {renderCalendar()}
      </div>

      {/* Time Selection Section */}
      <div className="border-t pt-4 mb-6">
        <div className="font-medium text-sm mb-2">Select Time</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-sm">Start Time *</label>
            <select className="border w-full px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              <option value="">Select start time</option>
              {filteredStartTimeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="font-medium text-sm">End Time *</label>
            <select className="border w-full px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={!startTime}>
              <option value="">Select end time</option>
              {endTimeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="font-medium text-sm">Attendees (Optional)</label>
          <input 
            type="text" 
            className="border w-full px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Enter attendees" 
            value={attendees} 
            onChange={(e) => setAttendees(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={handleConfirm}>Confirm Booking</button>
      </div>
    </>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold mb-2">Processing Booking...</h3>
      <p className="text-gray-600 mb-4">Please wait while we confirm your booking</p>
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2"><CheckCircle size={14} className="text-green-500" /><span>Saving to database...</span></div>
        <div className="flex items-center justify-center gap-2"><CheckCircle size={14} className="text-green-500" /><span>Saving to local storage...</span></div>
        <div className="flex items-center justify-center gap-2"><Loader size={14} className="text-blue-500 animate-pulse" /><span>Sending email confirmation...</span></div>
        <div className="flex items-center justify-center gap-2"><Clock size={14} className="text-yellow-500" /><span>Scheduling 30-minute reminder...</span></div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-green-600" /></div>
      <h3 className="text-lg font-semibold mb-2">Booking Confirmed! ✅</h3>
      <p className="text-gray-600 mb-2">Your meeting room has been successfully booked.</p>
      <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
        <p className="font-medium text-sm mb-1">Booking Details:</p>
        <p className="text-sm"><strong>Room:</strong> {room.name}</p>
        <p className="text-sm"><strong>Date:</strong> {selectedDate}</p>
        <p className="text-sm"><strong>Time:</strong> {startTime} - {endTime}</p>
        <p className="text-sm">
          <strong>Booking ID:</strong> {bookingIdString || "BK-" + bookingId || "Generated by system"}
        </p>
        <p className="text-sm mt-2 text-green-600 font-medium">✓ Saved to database and local storage</p>
      </div>
      <div className={`p-3 rounded-lg mb-4 ${emailMethod === 'EmailJS' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
        <p className="text-sm font-medium">{emailMethod === 'EmailJS' ? '📧 Email Sent!' : '📧 Demo Mode Active'}</p>
        <p className="text-xs">{emailMethod === 'EmailJS' ? `Confirmation email sent to ${userEmail}` : 'Email would be sent in production. Configure EmailJS for real emails.'}</p>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-6">
        <p className="text-sm font-medium">⏰ Reminder Scheduled</p>
        <p className="text-xs">You'll receive a reminder 30 minutes before your meeting.</p>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onClose}>Close</button>
      <p className="text-xs text-gray-400 mt-4">Closing automatically in 3 seconds...</p>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32} className="text-red-600" /></div>
      <h3 className="text-lg font-semibold mb-2">Booking Failed</h3>
      <p className="text-gray-600 mb-4">{errorMessage || "There was an error processing your booking. Please try again."}</p>
      <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 mr-2" onClick={() => {
        setErrorMessage("");
        setBookingStep("form");
      }}>Try Again</button>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onClose}>Close</button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) setShowCalendar(false); }}>
      <div className="bg-white w-[500px] rounded-xl shadow-xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700" onClick={onClose} disabled={bookingStep === "processing"}><X size={18} /></button>
        {bookingStep === "form" && renderForm()}
        {bookingStep === "processing" && renderProcessing()}
        {bookingStep === "success" && renderSuccess()}
        {bookingStep === "error" && renderError()}
      </div>
    </div>
  );
}