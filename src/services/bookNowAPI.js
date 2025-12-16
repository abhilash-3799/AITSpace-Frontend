// bookNowAPI.js - Frontend API service
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
                roomName: bookingData.roomName,
                floor: bookingData.floor,
                capacity: extractCapacity(bookingData.capacity),
                date: bookingData.date, // "2025-12-12" format is OK
                startTime: bookingData.startTime, // "16:30" format
                endTime: bookingData.endTime, // "18:00" format
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Booking failed');
            }
            
            return await response.json();
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
    cancelBooking: async (bookingId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
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