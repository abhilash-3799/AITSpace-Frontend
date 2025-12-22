import SeatButton from "./SeatButton";

export default function SeatGrid({ seats = [], onSeatClick }) {
    return (
        <div className="grid grid-cols-25 gap-4 justify-center">
            {seats.map((seat) => (
                <SeatButton key={seat.id} id={seat.id} status={seat.status} onClick={onSeatClick} />
            ))}
        </div>
    );
}
