import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPicker({ initialDate, onSelect }) {
    const [selectedDate, setSelectedDate] = useState(
        initialDate || new Date().toISOString().split("T")[0]
    );
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const daysInMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const firstDayOfMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const formatDate = (y, m, d) =>
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const isDisabled = (y, m, d) => new Date(y, m, d) < today;

    const isSelected = (y, m, d) => selectedDate === formatDate(y, m, d);

    const changeMonth = (inc) =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + inc, 1)
        );

    const clickDate = (y, m, d) => {
        if (!isDisabled(y, m, d)) {
            const formatted = formatDate(y, m, d);
            setSelectedDate(formatted);
            onSelect(formatted);
        }
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const totalDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);

        const rows = [];
        let dayCounter = 1;

        for (let week = 0; week < 6; week++) {
            const row = [];

            for (let weekday = 0; weekday < 7; weekday++) {
                const isEmpty = week === 0 && weekday < firstDay;
                const isOverflow = dayCounter > totalDays;

                if (isEmpty || isOverflow) {
                    row.push(
                        <div key={`empty-${week}-${weekday}`} className="h-8"></div>
                    );
                } else {
                    const disabled = isDisabled(year, month, dayCounter);
                    const selected = isSelected(year, month, dayCounter);

                    row.push(
                        <button
                            key={`day-${year}-${month}-${dayCounter}`}
                            disabled={disabled}
                            onClick={() => clickDate(year, month, dayCounter)}
                            className={`h-8 w-full rounded text-xs flex items-center justify-center
                            ${disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer hover:bg-blue-100"}
                            ${selected ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                        `}
                        >
                            {dayCounter}
                        </button>
                    );

                    dayCounter++;
                }
            }

            rows.push(
                <div key={`week-${week}`} className="grid grid-cols-7 gap-1">
                    {row}
                </div>
            );

            if (dayCounter > totalDays) break;
        }

        return rows;
    };


    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <ChevronLeft size={18} />
                </button>

                <span className="font-semibold text-sm">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>

                <button
                    onClick={() => changeMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {dayNames.map((d) => (
                    <div key={d} className="text-xs text-gray-600 flex justify-center">
                        {d}
                    </div>
                ))}
            </div>

            {renderCalendar()}
        </div>
    );
}
