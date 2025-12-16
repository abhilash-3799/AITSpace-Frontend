import { Calendar } from "lucide-react";

export default function FloorSelector() {
    const floors = ["Floor 1", "Floor 2", "Floor 3", "Floor 4"];

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center text-gray-700">
                    <span>📍</span>
                    <span className="font-medium">Select Floor</span>
                </div>

                <div className="flex gap-2 text-gray-700 items-center">
                    <Calendar className="w-4 h-4" />
                    <span>Nov 27, 2025</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
                {floors.map((floor) => (
                    <button
                        key={floor}
                        className={`p-3 border rounded-lg ${floor === "Floor 3"
                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                : "border-gray-300 text-gray-600"
                            }`}
                    >
                        {floor}
                    </button>
                ))}
            </div>
        </div>
    );
}
