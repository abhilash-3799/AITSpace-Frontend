import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsReports() {
  // Sample Data
  const seatUtilization = [
    { day: "Mon", floor1: 70, floor2: 65, floor3: 80 },
    { day: "Tue", floor1: 75, floor2: 68, floor3: 85 },
    { day: "Wed", floor1: 80, floor2: 72, floor3: 82 },
    { day: "Thu", floor1: 78, floor2: 70, floor3: 84 },
    { day: "Fri", floor1: 68, floor2: 63, floor3: 75 },
  ];

  const roomUsage = [
    { room: "Boardroom A", hours: 32 },
    { room: "Conference B", hours: 28 },
    { room: "Huddle 1", hours: 18 },
    { room: "Huddle 2", hours: 15 },
    { room: "Creative Studio", hours: 14 },
  ];

  const queueWaitStats = [
    { range: "< 20 mins", value: 35 },
    { range: "20-30 mins", value: 25 },
    { range: "30-45 mins", value: 20 },
    { range: "> 45 mins", value: 10 },
    { range: "No Wait", value: 10 },
  ];

  const hybridTrend = [
    { week: "Week 1", onsite: 60, remote: 40 },
    { week: "Week 2", onsite: 62, remote: 38 },
    { week: "Week 3", onsite: 64, remote: 36 },
    { week: "Week 4", onsite: 66, remote: 34 },
  ];

  const COLORS = ["#4f46e5", "#1d4ed8", "#16a34a", "#f97316", "#e11d48"];

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-10 py-10">
      <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
      <p className="text-gray-600 mb-6">
        Insights into workspace utilization and trends
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-600">Avg. Occupancy</p>
          <h2 className="text-2xl font-semibold mt-2">87%</h2>
          <p className="text-green-600 text-sm mt-1">⬆ +12.5%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-600">Meeting Hours</p>
          <h2 className="text-2xl font-semibold mt-2">122h</h2>
          <p className="text-green-600 text-sm mt-1">⬆ +7%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-600">Avg Queue Time</p>
          <h2 className="text-2xl font-semibold mt-2">10 min</h2>
          <p className="text-red-600 text-sm mt-1">⬇ -3%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <h2 className="text-2xl font-semibold mt-2">242</h2>
          <p className="text-green-600 text-sm mt-1">⬆ +11%</p>
        </div>
      </div>

      {/* Seat Utilization Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
        <h2 className="font-semibold mb-4">Seat Utilization By Floor</h2>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={seatUtilization}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="floor1" fill="#4f46e5" />
            <Bar dataKey="floor2" fill="#1d4ed8" />
            <Bar dataKey="floor3" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Room Usage + Pie Chart */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        {/* Meeting Room Usage */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-4">Meeting Room Usage</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={roomUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="room" />
              <Tooltip />
              <Bar dataKey="hours" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-4">Queue Wait Time Distribution</h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={queueWaitStats}
                dataKey="value"
                nameKey="range"
                outerRadius={100}
                label
              >
                {queueWaitStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
        <h2 className="font-semibold mb-4">Hybrid Occupancy Trends</h2>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={hybridTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="onsite" stroke="#4f46e5" strokeWidth={2} />
            <Line type="monotone" dataKey="remote" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
        <h2 className="font-semibold mb-4">Insights</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border">
            <p className="font-medium">Peak Usage</p>
            <p className="text-gray-600 text-sm mt-2">
              Floor 3 shows 95%+ capacity on Wed–Thu.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border">
            <p className="font-medium">Optimal Utilization</p>
            <p className="text-gray-600 text-sm mt-2">
              Meeting rooms show healthy 70–80% usage.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border">
            <p className="font-medium">Queue Improvement</p>
            <p className="text-gray-600 text-sm mt-2">
              Avg wait time reduced by 15% compared to last month.
            </p>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 bg-gray-100 border rounded-lg">
          Export as PDF
        </button>
        <button className="px-4 py-2 bg-gray-100 border rounded-lg">
          Export as CSV
        </button>
      </div>
    </div>
  );
}
