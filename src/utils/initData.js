
export const initializeSampleData = () => {
  
  const existingOffices = localStorage.getItem('officeConfigs');
  if (existingOffices) return; 

  const sampleOffices = [
    {
      id: "1",
      name: "Main Headquarters",
      address: "123 Tech Street, San Francisco, CA",
      floors: 5,
      totalRooms: 12,
      description: "Primary corporate office",
      rooms: [
        {
          id: "room-1",
          name: "Boardroom A",
          floor: "3",
          capacity: "Up to 12 people",
          description: "Large boardroom perfect for executive meetings and presentations",
          amenities: ["video", "projector", "whiteboard", "wifi"],
          availability: 90,
          isActive: true
        },
        {
          id: "room-2",
          name: "Conference Room B",
          floor: "3",
          capacity: "Up to 8 people",
          description: "Medium-sized room ideal for team meetings",
          amenities: ["video", "tv", "wifi"],
          availability: 100,
          isActive: true
        },
        {
          id: "room-3",
          name: "Huddle Space 1",
          floor: "2",
          capacity: "Up to 4 people",
          description: "Cozy space for small team discussions",
          amenities: ["tv", "wifi"],
          availability: 100,
          isActive: true
        },
        {
          id: "room-4",
          name: "Huddle Space 2",
          floor: "2",
          capacity: "Up to 4 people",
          description: "Ideal for quick sync-ups and 1-on-1s",
          amenities: ["tv", "wifi"],
          availability: 100,
          isActive: true
        },
        {
          id: "room-5",
          name: "Training Room",
          floor: "1",
          capacity: "Up to 20 people",
          description: "Spacious room designed for workshops and training sessions",
          amenities: ["projector", "wifi", "whiteboard"],
          availability: 80,
          isActive: true
        },
        {
          id: "room-6",
          name: "Creative Studio",
          floor: "4",
          capacity: "Up to 6 people",
          description: "Collaborative space for brainstorming and creative sessions",
          amenities: ["tv", "wifi", "whiteboard"],
          availability: 75,
          isActive: true
        }
      ]
    }
  ];

  localStorage.setItem('officeConfigs', JSON.stringify(sampleOffices));

  if (!localStorage.getItem('meetingBookings')) {
    localStorage.setItem('meetingBookings', JSON.stringify([]));
  }
  

  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
  
  console.log('Sample data initialized successfully');
};


export const initializeSampleDataOnDemand = () => {
  const sampleOffices = [
    {
      id: "1",
      name: "Main Headquarters",
      address: "123 Tech Street, San Francisco, CA",
      floors: 5,
      totalRooms: 12,
      description: "Primary corporate office",
      rooms: [
        {
          id: "room-1",
          name: "Boardroom A",
          floor: "3",
          capacity: "Up to 12 people",
          description: "Large boardroom perfect for executive meetings and presentations",
          amenities: ["video", "projector", "whiteboard", "wifi"],
          availability: 90,
          isActive: true
        },
        {
          id: "room-2",
          name: "Conference Room B",
          floor: "3",
          capacity: "Up to 8 people",
          description: "Medium-sized room ideal for team meetings",
          amenities: ["video", "tv", "wifi"],
          availability: 100,
          isActive: true
        },
        {
          id: "room-3",
          name: "Huddle Space 1",
          floor: "2",
          capacity: "Up to 4 people",
          description: "Cozy space for small team discussions",
          amenities: ["tv", "wifi"],
          availability: 100,
          isActive: true
        },
        {
          id: "room-4",
          name: "Huddle Space 2",
          floor: "2",
          capacity: "Up to 4 people",
          description: "Ideal for quick sync-ups and 1-on-1s",
          amenities: ["tv", "wifi"],
          availability: 100,
          isActive: true
        },
        {
          id: "room-5",
          name: "Training Room",
          floor: "1",
          capacity: "Up to 20 people",
          description: "Spacious room designed for workshops and training sessions",
          amenities: ["projector", "wifi", "whiteboard"],
          availability: 80,
          isActive: true
        },
        {
          id: "room-6",
          name: "Creative Studio",
          floor: "4",
          capacity: "Up to 6 people",
          description: "Collaborative space for brainstorming and creative sessions",
          amenities: ["tv", "wifi", "whiteboard"],
          availability: 75,
          isActive: true
        }
      ]
    }
  ];

  localStorage.setItem('officeConfigs', JSON.stringify(sampleOffices));
  
  if (!localStorage.getItem('meetingBookings')) {
    localStorage.setItem('meetingBookings', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
  
  return sampleOffices;
};

export default initializeSampleData;