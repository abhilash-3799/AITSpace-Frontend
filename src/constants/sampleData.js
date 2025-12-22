// data/sampleData.js
export const generateSampleMeetingBookings = () => {
  const sampleData = [
    {
      id: 1,
      room: "Conference Room A",
      date: "Mon, Dec 1",
      start: "10:00 AM",
      end: "11:30 AM",
      attendees: 5,
      status: "Active",
      type: "meeting"
    },
    {
      id: 2,
      room: "Meeting Room B",
      date: "Tue, Dec 2",
      start: "2:00 PM",
      end: "3:00 PM",
      attendees: 8,
      status: "Completed",
      type: "meeting"
    },
    {
      id: 3,
      room: "Board Room",
      date: "Wed, Dec 3",
      start: "9:00 AM",
      end: "10:30 AM",
      attendees: 12,
      status: "Active",
      type: "meeting"
    }
  ];

  // Initialize localStorage with sample data if empty
  if (!localStorage.getItem("meetingBookings")) {
    localStorage.setItem("meetingBookings", JSON.stringify(sampleData));
  }
  
  return sampleData;
};