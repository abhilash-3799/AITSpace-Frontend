export default function SeatButton({ id, status, onClick }) {
    const colors = {
        booked: "bg-red-500",
        available: "bg-green-500",
        yourSeat: "bg-blue-500",
        unavailable: "bg-gray-300",
    };

    const isInteractive = status === 'available' || status === 'yourSeat';

    return (
        <button
            onClick={isInteractive ? (() => onClick && onClick(id)) : undefined}
            disabled={!isInteractive}
            title={isInteractive ? (status === 'yourSeat' ? 'Your selected seat (click to unselect)' : 'Click to select') : status}
            className={`w-10 h-10 rounded-md text-white text-sm font-medium flex items-center justify-center ${colors[status]}`}
        >
            {id}
        </button>
    );
}
