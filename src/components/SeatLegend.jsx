export default function SeatLegend() {
    return (
        <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded"></span> Available
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded"></span> Booked
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded"></span> Your Seat
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-300 rounded"></span> Unavailable
            </div>
        </div>
    );
}
