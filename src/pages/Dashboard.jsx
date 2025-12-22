import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Progress } from "../components/ui/progress";
import { Bell, Calendar, DoorOpen, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const formattedDate = `${dayName}, ${dateStr}`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-2xl font-semibold">Welcome back, {user?.name}!</div>
      <div className="text-gray-500">{formattedDate}</div>

      {/* Top Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigate("/book-seat")}>
          <CardContent className="p-6 space-y-2">
            <div className="font-medium text-lg">Book a Seat</div>
            <div className="text-gray-500 text-sm">Reserve your workspace for today or upcoming days</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all"
        onClick={()=> navigate("/meeting-rooms")}>
          <CardContent className="p-6 space-y-2">
            <div className="font-medium text-lg flex items-center gap-2"><Users size={18} /> Book Meeting Room</div>
            <div className="text-gray-500 text-sm">Reserve a meeting room with required capacity</div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="font-medium mb-1">Today's Seat</div>
            <div className="text-gray-600 text-sm">Seat S-12 • Floor 3</div>
            <div className="text-green-600 font-semibold mt-2">Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="font-medium mb-1">Meetings Today</div>
            <div className="text-gray-600 text-sm">1 scheduled</div>
            <div className="font-semibold mt-2">14:00 - 15:00</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="font-medium mb-1">Notifications</div>
              <Bell size={18} />
            </div>
            <div className="text-gray-600 text-sm">1 unread</div>
            <Button variant="link" className="p-0 text-blue-600">View all →</Button>
          </CardContent>
        </Card>
      </div>

      {/* Floor Occupancy */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="font-medium text-lg">Floor Occupancy</div>

          {[{
            floor: "Floor 1", occupied: 60, label: "Available", seats: "24/40 seats", color: "bg-green-500"
          }, {
            floor: "Floor 2", occupied: 80, label: "Filling Up", seats: "32/40 seats", color: "bg-orange-500"
          }, {
            floor: "Floor 3", occupied: 95, label: "Almost Full", seats: "38/40 seats", color: "bg-red-500"
          }].map((f) => (
            <div key={f.floor} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div>{f.floor}</div>
                <div className="text-gray-600">{f.seats}</div>
              </div>
              <Progress value={f.occupied} className="h-3" indicatorClassName={f.color} />
              <div className="text-xs text-gray-500">{f.occupied}% occupied — <span className="font-semibold">{f.label}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="font-medium text-lg mb-2">Recent Activity</div>

          <div className="text-sm border-b pb-3">
            <div className="text-green-600 font-medium">Seat Booked Successfully</div>
            <div>Your seat S-12 on Floor 3 has been confirmed for today.</div>
            <div className="text-gray-500 text-xs mt-1">06:58 PM</div>
          </div>

          <div className="text-sm">
            <div className="text-blue-600 font-medium">Queue Status Updated</div>
            <div>You are now #2 in the queue for Floor 3.</div>
            <div className="text-gray-500 text-xs mt-1">08:58 PM</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
