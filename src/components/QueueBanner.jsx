import { Users } from "lucide-react";

export default function QueueBanner() {
  return (
    <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4">
      <div className="p-2 bg-orange-100 rounded-lg">
        <Users className="w-6 h-6 text-orange-600" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-1">Floor 3 is Full</h3>
        <p className="text-gray-700 mb-4">
          All seats on this floor are currently booked. Join the queue to be
          notified when a seat becomes available.
        </p>

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold">
          Join Queue for Floor 3
        </button>
      </div>
    </div>
  );
}