// layout/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import your existing navbar

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Your existing top navbar */}
            <Navbar />
            
            {/* Main content area */}
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}