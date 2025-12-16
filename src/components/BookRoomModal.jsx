import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BookRoomModal({ open, room, onClose, onConfirm }) {
    const todayStr = new Date().toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attendees, setAttendees] = useState("");

    if (!open) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (year, month, day) => {
        const m = String(month + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        return `${year}-${m}-${d}`;
    };

    const isDateDisabled = (year, month, day) => {
        const date = new Date(year, month, day);
        return date < today;
    };

    const isDateSelected = (year, month, day) => {
        return selectedDate === formatDate(year, month, day);
    };

    const handleDateClick = (year, month, day) => {
        if (!isDateDisabled(year, month, day)) {
            setSelectedDate(formatDate(year, month, day));
        }
    };

    const changeMonth = (increment) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const days = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);
        const weeks = [];
        let day = 1;

        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push(<div key={`empty-${j}`} className="h-8"></div>);
                } else if (day > days) {
                    week.push(<div key={`empty-end-${j}`} className="h-8"></div>);
                } else {
                    const currentDay = day;
                    const disabled = isDateDisabled(year, month, currentDay);
                    const selected = isDateSelected(year, month, currentDay);

                    week.push(
                        <button
                            key={day}
                            onClick={() => handleDateClick(year, month, currentDay)}
                            disabled={disabled}
                            className={`h-8 w-full rounded flex items-center justify-center text-xs transition-colors
                                ${disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-100 cursor-pointer"}
                                ${selected ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                                ${!disabled && !selected ? "text-gray-700" : ""}
                            `}
                        >
                            {currentDay}
                        </button>
                    );
                    day++;
                }
            }
            weeks.push(<div key={i} className="grid grid-cols-7 gap-1">{week}</div>);
            if (day > days) break;
        }

        return weeks;
    };

    const generateTimeSlots = () => {
        const times = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hh = String(h).padStart(2, "0");
                const mm = String(m).padStart(2, "0");
                times.push(`${hh}:${mm}`);
            }
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    const filteredEndTimes = startTime
        ? timeSlots.filter((t) => t > startTime)
        : timeSlots;

    const handleConfirm = () => {
        if (!startTime || !endTime || !attendees) return;

        onConfirm({
            date: selectedDate,
            startTime,
            endTime,
            attendees
        });
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-3/5 max-w-xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Book Meeting Room</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Room</p>
                    <p className="font-medium">{room?.name}</p>
                </div>

                <div className="mt-4">
                    <label className="font-medium text-sm">Select Date</label>

                    <div className="border rounded p-3 mt-2 bg-white">
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="font-semibold text-sm">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {dayNames.map(day => (
                                <div key={day} className="h-6 flex items-center justify-center text-xs font-medium text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {renderCalendar()}

                        <div className="mt-2 text-xs text-gray-600">
                            Selected: {selectedDate}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    
                    <div>
                        <label className="font-medium text-sm">Start Time</label>
                        <select
                            value={startTime}
                            onChange={(e) => {
                                setStartTime(e.target.value);
                                setEndTime("");
                            }}
                            className="mt-1 w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="">Select start time</option>
                            {timeSlots.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-medium text-sm">End Time</label>
                        <select
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="mt-1 w-full border px-3 py-2 rounded-lg"
                            disabled={!startTime}
                        >
                            <option value="">Select end time</option>
                            {filteredEndTimes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="mt-4">
                    <label className="font-medium text-sm">Number of Attendees</label>
                    <input
                        type="number"
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        min="1"
                        max={room?.capacity || 50}
                        className="mt-1 w-full border px-3 py-2 rounded-lg"
                        placeholder="Enter number of attendees"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={!startTime || !endTime || !attendees}
                        className={`px-4 py-2 rounded text-white ${
                            startTime && endTime && attendees
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Confirm Booking
                    </button>
                </div>

            </div>
        </div>
    );
}
