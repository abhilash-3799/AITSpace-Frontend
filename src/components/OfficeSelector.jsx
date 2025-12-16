import { Calendar, MapPin } from "lucide-react";

export default function FloorSelector({
  floors = ["Pune", "Nagpur"],
  selectedFloor,
  onSelect,
  date,
}) {
  const formatted = date
    ? date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center text-gray-700">
          <MapPin />
          <span className="font-medium">Select Office</span>
        </div>

        <div className="flex gap-2 text-gray-700 items-center">
          <Calendar className="w-4 h-4" />
          <span>{formatted}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {floors.map((floor) => (
          <button
            key={floor}
            onClick={() => onSelect && onSelect(floor)}
            className={`p-3 border rounded-lg transition-colors duration-200 ${
              floor === selectedFloor
                ? "border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {floor}
          </button>
        ))}
      </div>
    </div>
  );
}
