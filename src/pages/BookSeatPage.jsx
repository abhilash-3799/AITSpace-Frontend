import React, { useState, useEffect } from "react";
import FloorSelector from "../components/OfficeSelector";
import OccupancyStats from "../components/OccupancyStats";
import SeatLegend from "../components/SeatLegend";
import MeetingRoomButton from "../components/MeetingRoomButton";
import SeatGrid from "../components/SeatGrid";
import QueueBanner from "../components/QueueBanner";
import BookingModal from "../components/BookingModal";
import useSeatHistory from "../components/useSeatHistory";
import seatBookingApi from "../api/seatBookingApi";

const FLOORS = ["Pune", "Nagpur"];

function mapBackendSeatToFrontend(backendSeat) {
  // Extract numeric ID from seatNumber (e.g., "S-1" -> 1)
  let numericId = 0;
  if (backendSeat.seatNumber) {
    const match = backendSeat.seatNumber.match(/(\d+)/);
    if (match) {
      numericId = parseInt(match[1], 10);
    }
  }

  // SIMPLE AND CORRECT STATUS LOGIC
  let status = "available";

  // Debug log
  console.log(`Mapping seat ${backendSeat.seatNumber}:`, {
    active: backendSeat.isActive,
    available: backendSeat.isAvailable,
    seatStatus: backendSeat.seatStatus
  });

  if (backendSeat.isActive === false) {
    status = "unavailable";
  } else if (backendSeat.seatStatus === "ALLOCATED") {
    status = "booked";
  } else if (backendSeat.isAvailable === false) {
    status = "booked";
  } else {
    status = "available";
  }

  return {
    id: numericId || backendSeat.seatNumber || '0',
    status: status,
    bookedDate: null,
    seatId: backendSeat.seatId,
    seatNumber: backendSeat.seatNumber,
    officeName: backendSeat.officeName,
    teamName: backendSeat.teamName,
    queueName: backendSeat.queueName,
    seatStatus: backendSeat.seatStatus,
    isAvailable: backendSeat.isAvailable,
    isActive: backendSeat.isActive
  };
}

export default function BookSeatPage() {
  const [currentFloor, setCurrentFloor] = useState(FLOORS[0]);
  const [floorSeats, setFloorSeats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");

  const seats = floorSeats[currentFloor] || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSeat, setModalSeat] = useState(null);

  const today = new Date();

  const { saveHistory } = useSeatHistory();

  useEffect(() => {
    const fetchSeatsFromBackend = async () => {
      setIsLoading(true);
      setError(null);
      setDebugInfo("");

      try {
        console.log('Fetching seats from backend...');
        const allSeats = await seatBookingApi.getAllSeats();
        console.log('Backend seats received:', allSeats.length, 'seats');

        if (allSeats.length === 0) {
          throw new Error('No seats available in database');
        }

        // Debug: Show sample seat data
        if (allSeats.length > 0) {
          console.log('Sample seat data (first 3):', allSeats.slice(0, 3));
        }

        const groupedSeats = {};
        let availableCount = 0;
        let bookedCount = 0;
        let unavailableCount = 0;

        allSeats.forEach((backendSeat) => {
          const officeName = backendSeat.officeName || "Unknown";

          if (!groupedSeats[officeName]) {
            groupedSeats[officeName] = [];
          }

          const frontendSeat = mapBackendSeatToFrontend(backendSeat);
          groupedSeats[officeName].push(frontendSeat);

          // Count statuses
          if (frontendSeat.status === "available") availableCount++;
          if (frontendSeat.status === "booked") bookedCount++;
          if (frontendSeat.status === "unavailable") unavailableCount++;
        });

        console.log('Seat counts:', { availableCount, bookedCount, unavailableCount });
        setDebugInfo(`Total: ${allSeats.length} | Available: ${availableCount} | Booked: ${bookedCount} | Unavailable: ${unavailableCount}`);

        setFloorSeats(groupedSeats);

        if (!groupedSeats[currentFloor] && Object.keys(groupedSeats).length > 0) {
          setCurrentFloor(Object.keys(groupedSeats)[0]);
        }

      } catch (error) {
        console.error('Error fetching seats:', error.message);
        setError('Failed to load seats: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatsFromBackend();
  }, []);

  const refreshSeats = async () => {
    setIsLoading(true);
    try {
      const allSeats = await seatBookingApi.getAllSeats();

      if (allSeats.length === 0) {
        throw new Error('No seats available');
      }

      const groupedSeats = {};
      allSeats.forEach((backendSeat) => {
        const officeName = backendSeat.officeName || "Unknown";
        if (!groupedSeats[officeName]) {
          groupedSeats[officeName] = [];
        }
        groupedSeats[officeName].push(mapBackendSeatToFrontend(backendSeat));
      });

      setFloorSeats(groupedSeats);
      setError(null);
      console.log('Seats refreshed');
    } catch (error) {
      console.error('Error refreshing:', error);
      setError('Refresh failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  function handleSelectFloor(floor) {
    setCurrentFloor(floor);
  }

  function handleSeatClick(seatId) {
    const seat = seats.find((s) => s.id === seatId);
    console.log('Clicked seat:', seat);
    if (seat?.status === "available") {
      setModalSeat(seatId);
      setModalOpen(true);
    } else {
      alert(`Cannot book this seat. Status: ${seat?.status}`);
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    setModalSeat(null);
  }

  async function handleConfirmBooking(bookingData) {
    if (!bookingData || !modalSeat) return;

    try {
      const seat = seats.find((s) => s.id === modalSeat);
      if (!seat) {
        throw new Error('Seat not found');
      }

      // Get user data from sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('userData')) || {};

      // Format data for backend according to SeatBookingRequestDTO
      const backendBookingData = {
        seatNumber: seat.seatNumber, // e.g., "S-1" or "SEAT-001"
        officeName: currentFloor,    // e.g., "Pune" or "Nagpur"
        employeeId: userData.employeeId, // Temporary - remove later
        bookingDate: bookingData.date, // "YYYY-MM-DD"
        startTime: bookingData.startTime, // "HH:MM"
        endTime: bookingData.endTime      // "HH:MM"
      };

      console.log('Sending booking data:', backendBookingData);

      // Call backend API with correct endpoint
      const response = await seatBookingApi.createBooking(backendBookingData);
      console.log('Booking successful:', response);

      // Save to local history
      saveHistory(modalSeat, currentFloor, bookingData.date);

      // Update UI
      setFloorSeats((prev) => {
        const updated = { ...prev };
        if (updated[currentFloor]) {
          updated[currentFloor] = updated[currentFloor].map((s) =>
            s.id === modalSeat
              ? {
                ...s,
                status: "booked",
                bookedDate: bookingData.date,
                isAvailable: false,
                seatStatus: "ALLOCATED"
              }
              : s
          );
        }
        return updated;
      });

      setModalOpen(false);
      setModalSeat(null);

      // Refresh after 1 second
      setTimeout(() => refreshSeats(), 1000);

      alert(`Booking successful! Seat ${seat.seatNumber} has been booked.`);

    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}`);
    }
  }

  const total = seats.length;
  const available = seats.filter((s) => s.status === "available").length;
  const booked = seats.filter((s) => s.status === "booked").length;
  const occupied = booked;
  const occupancyPercent = total ? Math.round((occupied / total) * 100) : 0;

  const availableFloors = Object.keys(floorSeats).filter(floor =>
    floorSeats[floor] && floorSeats[floor].length > 0
  );
  const displayFloors = availableFloors.length > 0 ? availableFloors : FLOORS;

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-gray-800">
      <div className="px-10 pt-10">
        <h1 className="text-2xl font-semibold mb-2">Book a Seat</h1>
        <p className="text-gray-600 mb-6">
          Select your preferred seat on the floor plan
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading seats...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">{error}</p>
                <button
                  onClick={refreshSeats}
                  className="mt-2 px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Retry
                </button>
              </div>
            )}

            {debugInfo && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{debugInfo}</p>
              </div>
            )}

            <FloorSelector
              floors={displayFloors}
              selectedFloor={currentFloor}
              onSelect={handleSelectFloor}
              date={today}
            />

            <OccupancyStats
              available={available}
              occupied={occupied}
              total={total}
              occupancy={occupancyPercent}
            />

            <div className="mt-8 bg-white p-6 border border-gray-200 rounded-xl">
              <h2 className="text-lg font-semibold mb-6">
                {currentFloor} - Interactive Map
              </h2>

              <SeatLegend />
              <MeetingRoomButton />
              <SeatGrid seats={seats} onSeatClick={handleSeatClick} />
            </div>

            <BookingModal
              open={modalOpen}
              seatId={modalSeat}
              Office={currentFloor}
              status={
                modalSeat
                  ? seats.find((s) => s.id === modalSeat)?.status || ""
                  : ""
              }
              initialDate={today.toISOString().slice(0, 10)}
              onClose={handleCloseModal}
              onConfirm={handleConfirmBooking}
            />

            <QueueBanner />
          </>
        )}
      </div>
    </div>
  );
}