export default function useSeatHistory() {
  const getHistory = () => {
    return JSON.parse(localStorage.getItem("seatBookings")) || [];
  };

  const saveHistory = (seatId, office, date) => {
    const seatData = getHistory();

    seatData.push({
      id: Date.now(),
      seatId,
      office,
      date,
      status: "Active",
    });

    localStorage.setItem("seatBookings", JSON.stringify(seatData));
  };

  return { getHistory, saveHistory };
}
