// src/api/seatBookingApi.js
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:8080/api";

export default function useSeatBookingApi() {
  const { user } = useAuth(); // logged-in user from AuthContext

  // ========================
  // Fetch all seats
  // ========================
  const getAllSeats = async () => {
    const res = await fetch(`${BASE_URL}/seats`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to fetch seats");
    }

    return res.json();
  };

  // ========================
  // Create booking
  // ========================
  const createBooking = async ({
    seatNumber,
    officeName,
    bookingDate,
    startTime,
    endTime,
  }) => {
    // 🔐 Safety check
    if (!user || !user.employeeId) {
      throw new Error("User not logged in or employee ID missing");
    }

    const payload = {
      seatNumber,
      officeName,
      employeeId: user.employeeId, // ✅ comes from login response
      bookingDate,
      startTime,
      endTime,
    };

    const res = await fetch(`${BASE_URL}/seat-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(data?.message || "Booking failed");
    }

    return data;
  };

  return {
    getAllSeats,
    createBooking,
  };
}
