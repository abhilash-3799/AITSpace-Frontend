
import { useState } from "react";
import { 
  X, Users, Tv, Wifi, Video, Projector, Clipboard, 
  Mail, Clock, CheckCircle, AlertCircle, Loader 
} from "lucide-react";
import { sendEmailNotification, scheduleReminder } from "../utils/notificationService";

export default function EnhancedBookRoomModal({ room, onClose }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [email, setEmail] = useState("");
  const [bookingStep, setBookingStep] = useState("form"); // form, processing, success, error
  const [emailMethod, setEmailMethod] = useState(""); // EmailJS, Mock, etc.
  const [bookingId, setBookingId] = useState(null);

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
    // Validation
    if (!startTime || !endTime || !attendees || !selectedDate || !email) {
      alert("Please fill all required fields.");
      return;
    }

    if (isPastDate(selectedDate)) {
      alert("Cannot book a room for a past date.");
      return;
    }

    if (Number(attendees) < 1) {
      alert("Please enter valid number of attendees.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      type: "meeting",
      room: room.name,
      floor: room.floor,
      capacity: room.capacity,
      date: selectedDate,
      start: startTime,
      end: endTime,
      attendees: Number(attendees),
      email: email,
      amenities: room.amenities || [],
      status: "Active",
      office: room.officeName || "Main Office",
      reminderSent: false,
      bookedAt: new Date().toLocaleString()
    };

    setBookingId(newBooking.id);
    setBookingStep("processing");

    try {
      // 1. Save booking to localStorage
      const allBookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
      allBookings.push(newBooking);
      localStorage.setItem("meetingBookings", JSON.stringify(allBookings));

      // 2. Send email notification
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

      // 3. Add in-app notification
      addMeetingNotification(newBooking, emailResult);

      // 4. Schedule reminder
      try {
        scheduleReminder(newBooking);
        console.log("⏰ Reminder scheduled");
      } catch (reminderError) {
        console.warn("Failed to schedule reminder:", reminderError);
      }

      // 5. Show success
      setBookingStep("success");

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error("Booking failed:", error);
      setBookingStep("error");
    }
  };

  const renderForm = () => (
    <>
      <h2 className="text-lg font-semibold mb-1">{`Book ${room.name}`}</h2>

      <div className="text-sm text-gray-700 mb-4">
        <div className="flex items-center gap-1">
          <Users size={16} /> {room.capacity}
        </div>
        <p className="mt-1">Floor {room.floor}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {room.amenities && room.amenities.length > 0 ? (
            room.amenities.slice(0, 4).map((amenityId, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
              >
                {getTagIcon(amenityId)} {getAmenityName(amenityId)}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No amenities configured</span>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label className="font-medium text-sm flex items-center gap-2">
          <Mail size={14} />
          Email for confirmation *
        </label>
        <input
          type="email"
          className="border w-full px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Confirmation email and reminders will be sent to this address
        </p>
      </div>

      <div className="mb-4">
        <label className="font-medium text-sm">Select Date *</label>
        <div className="mt-1 mb-2 text-xs text-gray-500">
          {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="block w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-medium text-sm">Start Time *</label>
          <select
            className="border w-full px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            <option value="">Select start time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-sm">End Time *</label>
          <select
            className="border w-full px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          >
            <option value="">Select end time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="font-medium text-sm">Number of Attendees *</label>
      <input
        type="number"
        min="1"
        max="100"
        className="border w-full px-3 py-2 rounded-lg mt-1 mb-5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
      />

      {/* Email Service Status */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 mt-0.5">
            <Mail size={16} />
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Email Service Status</p>
            <p className="text-xs text-blue-600">
              {emailMethod ? `Using: ${emailMethod}` : "Will use EmailJS if configured, otherwise demo mode"}
            </p>
          </div>
        </div>
      </div>

      {/* Reminder Notice */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="text-yellow-600 mt-0.5">
            <Clock size={16} />
          </div>
          <div>
            <p className="text-sm text-yellow-700 font-medium">30-Minute Reminder</p>
            <p className="text-xs text-yellow-600">
              You will receive a reminder notification 30 minutes before your meeting starts
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={handleConfirm}
        >
          Confirm Booking
        </button>
      </div>
    </>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold mb-2">Processing Booking...</h3>
      <p className="text-gray-600 mb-4">Please wait while we confirm your booking</p>
      
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle size={14} className="text-green-500" />
          <span>Saving booking details...</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Loader size={14} className="text-blue-500 animate-pulse" />
          <span>Sending email confirmation...</span>
        </div>
        {<div className="flex items-center justify-center gap-2">
          <Clock size={14} className="text-yellow-500" />
          <span>Scheduling 30-minute reminder...</span>
        </div> }
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Booking Confirmed! ✅</h3>
      <p className="text-gray-600 mb-2">
        Your meeting room has been successfully booked.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
        <p className="font-medium text-sm mb-1">Booking Details:</p>
        <p className="text-sm"><strong>Room:</strong> {room.name}</p>
        <p className="text-sm"><strong>Date:</strong> {selectedDate}</p>
        <p className="text-sm"><strong>Time:</strong> {startTime} - {endTime}</p>
        <p className="text-sm"><strong>Email:</strong> {email}</p>
        <p className="text-sm"><strong>Booking ID:</strong> {bookingId}</p>
      </div>
      
      { <div className={`p-3 rounded-lg mb-4 ${emailMethod === 'EmailJS' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
        <p className="text-sm font-medium">
          {emailMethod === 'EmailJS' ? '📧 Email Sent!' : '📧 Demo Mode Active'}
        </p>
        <p className="text-xs">
          {emailMethod === 'EmailJS' 
            ? `Confirmation email sent to ${email}`
            : 'Email would be sent in production. Configure EmailJS for real emails.'}
        </p>
      </div> }
      
      { <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-6">
        <p className="text-sm font-medium">⏰ Reminder Scheduled</p>
        <p className="text-xs">You'll receive a reminder 30 minutes before your meeting.</p>
      </div> }
      
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={onClose}
      >
        Close
      </button>
      
      <p className="text-xs text-gray-400 mt-4">
        Closing automatically in 3 seconds...
      </p>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={32} className="text-red-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Booking Failed</h3>
      <p className="text-gray-600 mb-4">
        There was an error processing your booking. Please try again.
      </p>
      <button
        className="px-4 py-2 border rounded-lg hover:bg-gray-100 mr-2"
        onClick={() => setBookingStep("form")}
      >
        Try Again
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[450px] rounded-xl shadow-xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          disabled={bookingStep === "processing"}
        >
          <X size={18} />
        </button>

        {bookingStep === "form" && renderForm()}
        {bookingStep === "processing" && renderProcessing()}
        {bookingStep === "success" && renderSuccess()}
        {bookingStep === "error" && renderError()}
      </div>
    </div>
  );
}