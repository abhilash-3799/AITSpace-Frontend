const API_BASE_URL = 'http://localhost:8080/api';

const seatBookingApi = {
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

    deleteBooking: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat-booking/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting booking:', error.message);
            throw error;
        }
    },

    createBulkBooking: async (teamLeadId, bookings) => {
        try {
            const response = await fetch(`${API_BASE_URL}/seat-booking/bulk/${teamLeadId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookings),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating bulk booking:', error.message);
            throw error;
        }
    },

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
            const allSeats = await seatBookingApi.getAllSeats();
            return allSeats.filter(seat => 
                seat.officeName && seat.officeName.toLowerCase() === officeName.toLowerCase()
            );
        } catch (error) {
            console.error('Error filtering seats by office:', error);
            return [];
        }
    }
};

export default seatBookingApi;