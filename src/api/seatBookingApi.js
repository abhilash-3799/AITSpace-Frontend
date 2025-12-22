const API_BASE_URL = 'http://localhost:8080/api';

const seatBookingApi = {
    // Create a new seat booking
    createBooking: async (bookingData) => {
        try {
            console.log('Sending booking data to backend:', bookingData);
            const response = await fetch(`${API_BASE_URL}/seat-booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating booking:', error.message);
            throw error;
        }
    },

    // Get all seat bookings
    getAllBookings: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat-booking`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings:', error.message);
            return [];
        }
    },

    // Get a specific booking by ID
    getBookingById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat-booking/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching booking:', error.message);
            throw error;
        }
    },

    // Update a booking
    updateBooking: async (id, bookingData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat-booking/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating booking:', error.message);
            throw error;
        }
    },

    // Cancel/delete a booking
    cancelBooking: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat-booking/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error.message);
            throw error;
        }
    },

    // // Create multiple bookings (bulk)
    // createBulkBooking: async (bookings) => {
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/seat-booking/bulk`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(bookings),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         return await response.json();
    //     } catch (error) {
    //         console.error('Error creating bulk booking:', error.message);
    //         throw error;
    //     }
    // },

    // Get bookings by employee ID
    getBookingsByEmployee: async (employeeId) => {
        try {
            // Filter from all bookings
            const allBookings = await seatBookingApi.getAllBookings();
            return allBookings.filter(booking => 
                booking.employee && booking.employee.employeeId === employeeId
            );
        } catch (error) {
            console.error('Error getting employee bookings:', error);
            return [];
        }
    },

    // Get bookings by seat ID
    getBookingsBySeat: async (seatId) => {
        try {
            // Filter from all bookings
            const allBookings = await seatBookingApi.getAllBookings();
            return allBookings.filter(booking => 
                booking.seat && booking.seat.seatId === seatId
            );
        } catch (error) {
            console.error('Error getting seat bookings:', error);
            return [];
        }
    },

    // Get active bookings (not cancelled)
    getActiveBookings: async () => {
        try {
            const allBookings = await seatBookingApi.getAllBookings();
            return allBookings.filter(booking => booking.isActive === true);
        } catch (error) {
            console.error('Error getting active bookings:', error);
            return [];
        }
    },

    // SEAT-RELATED APIS
    getAllSeats: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching seats:', error.message);
            return [];
        }
    },

    getSeatById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching seat:', error.message);
            throw error;
        }
    },

    getSeatsByOffice: async (officeName) => {
        try {
            // Method 1: Use backend filter if endpoint exists
            try {
                const response = await fetch(`${API_BASE_URL}/seat/office/${officeName}`);
                if (response.ok) {
                    return await response.json();
                }
            } catch (e) {
                // Fall back to client-side filtering
            }
            
            // Method 2: Client-side filtering
            const allSeats = await seatBookingApi.getAllSeats();
            return allSeats.filter(seat => 
                seat.office && seat.office.officeName && 
                seat.office.officeName.toLowerCase() === officeName.toLowerCase()
            );
        } catch (error) {
            console.error('Error filtering seats by office:', error);
            return [];
        }
    },

    getAvailableSeats: async () => {
        try {
            const allSeats = await seatBookingApi.getAllSeats();
            return allSeats.filter(seat => seat.isAvailable === true);
        } catch (error) {
            console.error('Error getting available seats:', error);
            return [];
        }
    },

    getBookedSeats: async () => {
        try {
            const allSeats = await seatBookingApi.getAllSeats();
            return allSeats.filter(seat => seat.isAvailable === false);
        } catch (error) {
            console.error('Error getting booked seats:', error);
            return [];
        }
    },

    // Check seat availability for a specific time slot
    checkSeatAvailability: async (seatId, startDateTime, endDateTime) => {
        try {
            const seatBookings = await seatBookingApi.getBookingsBySeat(seatId);
            
            // Filter active bookings that overlap with requested time
            const overlappingBookings = seatBookings.filter(booking => {
                if (!booking.isActive || booking.status === 'CANCELLED') {
                    return false;
                }
                
                const bookingStart = new Date(booking.startDateTime);
                const bookingEnd = new Date(booking.endDateTime);
                const requestedStart = new Date(startDateTime);
                const requestedEnd = new Date(endDateTime);
                
                // Check for overlap
                return (
                    (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
                    (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
                    (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
                );
            });
            
            return {
                isAvailable: overlappingBookings.length === 0,
                overlappingBookings: overlappingBookings
            };
        } catch (error) {
            console.error('Error checking seat availability:', error);
            return { isAvailable: false, overlappingBookings: [] };
        }
    }
};

export default seatBookingApi;