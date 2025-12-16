export default function OccupancyStats({ available = 0, occupied = 0, total = 0, occupancy = 0 }) {
    return (
        <div className="grid grid-cols-3 text-center py-4 border-t border-gray-200">
            <div>
                <p className="text-gray-600">Available</p>
                <p className="text-green-600 font-semibold">{available}</p>
            </div>

            <div className="border-l border-r border-gray-200">
                <p className="text-gray-600">Occupied</p>
                <p className="font-semibold">{occupied}/{total}</p>
            </div>

            <div>
                <p className="text-gray-600">Occupancy</p>
                <p className="text-red-600 font-semibold">{occupancy}%</p>
            </div>
        </div>
    );
}
