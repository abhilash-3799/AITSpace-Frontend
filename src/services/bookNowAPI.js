// bookNowAPI.js - Updated error handling
const API_BASE_URL = 'http://localhost:8080/api';

export const bookNowAPI = {
    // Book a meeting room
    bookMeetingRoom: async (bookingData) => {
        try {
            // Extract numeric capacity
            const extractCapacity = (capacityString) => {
                if (!capacityString) return 10;
                const match = capacityString.toString().match(/\d+/);
                return match ? parseInt(match[0], 10) : 10;
            };

            // Format data for backend
            const formattedData = {
                employeeId: bookingData.employeeId,
                roomName: bookingData.roomName,
                floor: bookingData.floor,
                capacity: extractCapacity(bookingData.capacity),
                date: bookingData.date,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                amenities: bookingData.amenities || [],
                officeName: bookingData.officeName,
                attendees: bookingData.attendees || null,
                email: bookingData.email || null,
                type: bookingData.type || "meeting"
            };

            console.log("📤 Sending formatted data:", formattedData);

            const response = await fetch(`${API_BASE_URL}/bookings/book-now`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:admin123')
                },
                body: JSON.stringify(formattedData)
            });
            
            if (!response.ok) {
                let errorMessage = 'Booking failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    
                    // Check for specific error messages
                    if (response.status === 409) {
                        errorMessage = errorData.message || "Room is already booked for the selected time slot";
                    } else if (response.status === 400) {
                        errorMessage = errorData.message || "Invalid booking request";
                    } else if (response.status === 404) {
                        errorMessage = errorData.message || "Employee not found";
                    }
                } catch (jsonError) {
                    // If response is not JSON, try to get text
                    const text = await response.text();
                    if (text) {
                        errorMessage = text;
                    }
                }
                
                // Create error object with status and message
                const error = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }
            
            const responseData = await response.json();
            console.log("✅ Backend response:", responseData);
            return responseData;
        } catch (error) {
            console.error('Booking API error:', error);
            throw error;
        }
    },
    
    // Check room availability
    checkAvailability: async (bookingData) => {
        try {
            // Extract numeric capacity
            const extractCapacity = (capacityString) => {
                if (!capacityString) return 10;
                const match = capacityString.toString().match(/\d+/);
                return match ? parseInt(match[0], 10) : 10;
            };

            // Format data for backend
            const formattedData = {
                employeeId: bookingData.employeeId,
                roomName: bookingData.roomName,
                floor: bookingData.floor,
                capacity: extractCapacity(bookingData.capacity),
                date: bookingData.date,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                amenities: bookingData.amenities || [],
                officeName: bookingData.officeName,
                attendees: bookingData.attendees || null,
                email: bookingData.email || null,
                type: bookingData.type || "meeting"
            };

            const response = await fetch(`${API_BASE_URL}/bookings/check-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:admin123')
                },
                body: JSON.stringify(formattedData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Availability check failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Availability check error:', error);
            throw error;
        }
    },
    
    // Get room availability percentage
    getRoomAvailability: async (roomName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/room/${roomName}/availability`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get availability');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get availability error:', error);
            throw error;
        }
    },
    
    // Get today's bookings for a room
    getRoomBookings: async (roomName, date) => {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/room/${roomName}/date/${date}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get bookings');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get bookings error:', error);
            throw error;
        }
    },
    
    // Cancel a booking
    cancelBooking: async (bookingIdString) => {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingIdString}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:admin123')
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel booking');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Cancel booking error:', error);
            throw error;
        }
    }
};