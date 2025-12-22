import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BookingModal({ open, seatId, Office, status, initialDate, onClose, onConfirm }) {
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (!open) return null;

    const formattedSeat = seatId ? `S-${seatId}` : '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
            <div className="w-3/5 max-w-2xl bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Book Seat</h3>
                    <button onClick={() => onClose && onClose()} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Seat Number</p>
                            <p className="font-medium">{formattedSeat}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Office</p>
                            <p className="font-medium">{Office}</p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-sm text-gray-600">Status</p>
                            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${status === 'available' ? 'bg-green-100 text-green-700' : status === 'booked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-2">Select Date</label>
                    <div className="border rounded p-3 bg-white">
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

                        {selectedDate && (
                            <div className="mt-3 text-xs text-gray-700">
                                Selected: <span className="font-medium">{selectedDate}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded">
                    Note: You can only book one seat per day. This booking will replace any existing booking for the selected date.
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => onClose && onClose()} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                    <button onClick={() => {
                        onConfirm && onConfirm(selectedDate);
                    }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Booking</button>
                </div>

            </div>
        </div>
    );
}