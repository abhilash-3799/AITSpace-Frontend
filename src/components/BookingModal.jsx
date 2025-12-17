import { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';


export default function BookingModal({ open, seatId, Office, status, initialDate, onClose, onConfirm }) {
    const { user } = useContext(AuthContext);

    if (!user || !user.employeeId) {
        setErrorMessage('User not logged in or employee ID missing');
        return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(initialDate || todayStr);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setStartTime('');
        setEndTime('');
        setErrorMessage('');
    }, [selectedDate]);

    useEffect(() => {
        if (open) {
            setSelectedDate(initialDate || todayStr);
            setStartTime('');
            setEndTime('');
            setCurrentMonth(new Date());
            setErrorMessage('');
        }
    }, [open, initialDate]);

    if (!open) return null;

    const formattedSeat = seatId ? `S-${seatId}` : '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDate === todayStr;

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (year, month, day) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
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
            setErrorMessage('');
        }
    };

    const changeMonth = (increment) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
    };

    const isTimeInPast = (timeString) => {
        if (!isToday) return false;

        const [hours, minutes] = timeString.split(':').map(Number);
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        if (hours < currentHours) return true;
        if (hours === currentHours && minutes <= currentMinutes) return true;

        return false;
    };

    const generateTimeSlots = () => {
        const times = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hh = String(h).padStart(2, '0');
                const mm = String(m).padStart(2, '0');
                const time = `${hh}:${mm}`;

                if (isToday && isTimeInPast(time)) {
                    continue;
                }

                times.push(time);
            }
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    const filteredEndTimes = startTime
        ? timeSlots.filter((t) => {
            const [startHour, startMin] = startTime.split(':').map(Number);
            const [endHour, endMin] = t.split(':').map(Number);

            if (endHour < startHour) return false;
            if (endHour === startHour && endMin <= startMin) return false;

            return true;
        })
        : timeSlots;

    const handleConfirm = async () => {
        if (!startTime || !endTime || !Office || !formattedSeat) {
            setErrorMessage('Please fill all required fields');
            return;
        }

        // Validate endTime > startTime
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        if (endHour < startHour || (endHour === startHour && endMin <= startMin)) {
            setErrorMessage('End time must be after start time');
            return;
        }

        // ✅ SAFETY CHECK: ensure user exists
        if (!user || !user.employeeId) {
            setErrorMessage('User not logged in or employee ID missing');
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage('');

            // Payload for backend
            const payload = {
                seatNumber: formattedSeat,
                officeName: Office,
                employeeId: user.employeeId, // now safe to access
                bookingDate: selectedDate,            // "yyyy-MM-dd"
                startTime: `${startTime}:00`,         // "HH:mm:ss"
                endTime: `${endTime}:00`              // "HH:mm:ss"
            };

            // Call API
            const response = await fetch('/api/seat-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const text = await response.text(); // read raw text first
            let data = null;
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = text; // fallback if not JSON
                }
            }

            if (!response.ok) {
                throw new Error((data && data.message) || 'Booking failed');
            }

            onConfirm && onConfirm(data);

        } catch (error) {
            console.error('Booking failed:', error);
            setErrorMessage(error.message || 'Failed to create booking.');
        } finally {
            setIsLoading(false);
        }
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
                    week.push(<div key={`empty-${j}`} className="h-7"></div>);
                } else if (day > days) {
                    week.push(<div key={`empty-end-${j}`} className="h-7"></div>);
                } else {
                    const currentDay = day;
                    const disabled = isDateDisabled(year, month, currentDay);
                    const selected = isDateSelected(year, month, currentDay);

                    week.push(
                        <button
                            key={day}
                            onClick={() => handleDateClick(year, month, currentDay)}
                            disabled={disabled}
                            className={`h-7 w-full rounded flex items-center justify-center text-xs transition-colors
                                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-100 cursor-pointer'}
                                ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                                ${!disabled && !selected ? 'text-gray-700' : ''}
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

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-4/5 max-w-md bg-white rounded-lg shadow-xl p-4 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Book Seat</h3>
                    <button
                        onClick={() => onClose && onClose()}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-3 bg-gray-50 p-3 rounded">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs text-gray-600">Seat Number</p>
                            <p className="font-medium text-sm">{formattedSeat}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Office</p>
                            <p className="font-medium text-sm">{Office}</p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-xs text-gray-600">Status</p>
                            <span className={`inline-block mt-0.5 px-2 py-1 text-xs rounded ${status === 'available' ? 'bg-green-100 text-green-700' : status === 'booked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <label className="block text-xs text-gray-600 mb-1">Select Date</label>
                    <div className="border rounded p-2 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                                disabled={isLoading}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="font-semibold text-xs">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-0.5 hover:bg-gray-100 rounded"
                                disabled={isLoading}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {dayNames.map(day => (
                                <div key={day} className="h-5 flex items-center justify-center text-xs font-medium text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {renderCalendar()}

                        {selectedDate && (
                            <div className="mt-2 text-xs text-gray-700">
                                Selected: <span className="font-medium">{selectedDate}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                        <select
                            value={startTime}
                            onChange={(e) => {
                                setStartTime(e.target.value);
                                setEndTime('');
                                setErrorMessage('');
                            }}
                            className="w-full p-1.5 border rounded text-xs"
                            disabled={isLoading}
                        >
                            <option value="">Select start time</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                        {isToday && startTime && isTimeInPast(startTime) && (
                            <p className="text-xs text-red-500 mt-0.5">This time has already passed</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs text-gray-600 mb-1">End Time</label>
                        <select
                            value={endTime}
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                setErrorMessage('');
                            }}
                            disabled={!startTime || isLoading}
                            className="w-full p-1.5 border rounded text-xs disabled:bg-gray-50 disabled:text-gray-500"
                        >
                            <option value="">Select end time</option>
                            {filteredEndTimes.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {endTime && startTime && (
                    <div className="mt-3 text-xs text-gray-700">
                        <span className="font-medium">Duration:</span> {startTime} - {endTime}
                        <span className="ml-2 text-gray-600">
                            {(() => {
                                const [startH, startM] = startTime.split(':').map(Number);
                                const [endH, endM] = endTime.split(':').map(Number);
                                const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
                                const hours = Math.floor(durationMinutes / 60);
                                const minutes = durationMinutes % 60;
                                return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
                            })()}
                        </span>
                    </div>
                )}

                {errorMessage && (
                    <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded">
                        {errorMessage}
                    </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={() => onClose && onClose()}
                        className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!startTime || !endTime || isLoading}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Booking...
                            </>
                        ) : (
                            'Confirm Booking'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}