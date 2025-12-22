import React, { useState } from "react";
import FloorSelector from "../components/OfficeSelector";
import OccupancyStats from "../components/OccupancyStats";
import SeatLegend from "../components/SeatLegend";
import MeetingRoomButton from "../components/MeetingRoomButton";
import SeatGrid from "../components/SeatGrid";
import QueueBanner from "../components/QueueBanner";
import BookingModal from "../components/BookingModal";
import useSeatHistory from "../components/useSeatHistory";


const FLOORS = ["Pune", "Nagpur"];

function generateSeats(seed = 0) {
  const seats = Array.from({ length: 150 }, (_, i) => {
    const idx = (i + seed) % 10;
    const status =
      idx === 0 || idx === 1
        ? "unavailable"
        : idx <= 4
        ? "booked"
        : "available";
    return { id: i + 1, status, bookedDate: null };
  });
  return seats;
}

export default function BookSeatPage() {
  const [currentFloor, setCurrentFloor] = useState(FLOORS[0]);
  const [floorSeats, setFloorSeats] = useState(() => {
    return Object.fromEntries(FLOORS.map((f, i) => [f, generateSeats(i)]));
  });

  const seats = floorSeats[currentFloor] || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSeat, setModalSeat] = useState(null);

  const today = new Date();

  // ⭐ Use history hook
  const { saveHistory } = useSeatHistory();

  function handleSelectFloor(floor) {
    setCurrentFloor(floor);
  }

  function handleSeatClick(seatId) {
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.status === "available") {
      setModalSeat(seatId);
      setModalOpen(true);
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    setModalSeat(null);
  }

  function handleConfirmBooking(date) {
    if (!date || !modalSeat) return;

    // ⭐⭐⭐ Replaced old logic with hook
    saveHistory(modalSeat, currentFloor, date);

    setFloorSeats((prev) => {
      const cleared = Object.fromEntries(
        Object.entries(prev).map(([floor, list]) => [
          floor,
          list.map((s) =>
            s.bookedDate === date
              ? { ...s, status: "available", bookedDate: null }
              : s
          ),
        ])
      );

      cleared[currentFloor] = cleared[currentFloor].map((s) =>
        s.id === modalSeat ? { ...s, status: "booked", bookedDate: date } : s
      );

      return cleared;
    });

    setModalOpen(false);
    setModalSeat(null);
  }

  const total = seats.length;
  const available = seats.filter((s) => s.status === "available").length;
  const booked = seats.filter((s) => s.status === "booked").length;
  const occupied = booked;
  const occupancyPercent = total ? Math.round((occupied / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-gray-800">
      <div className="px-10 pt-10">
        <h1 className="text-2xl font-semibold mb-2">Book a Seat</h1>
        <p className="text-gray-600 mb-6">
          Select your preferred seat on the floor plan
        </p>

        <FloorSelector
          floors={FLOORS}
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
      </div>
    </div>
  );
}
