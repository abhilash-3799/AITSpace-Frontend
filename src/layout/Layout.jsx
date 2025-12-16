
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="min-h-screen">
            <Navbar />
            
            {/* Admin banner - only shows for setup */}
            <div className="bg-blue-50 border-b border-blue-200 p-2 text-center">
                <a 
                    href="/admin/meeting-rooms-config" 
                    className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                >
                    ⚙️ Need to setup meeting rooms? Go to Admin Panel
                </a>
            </div>
            
            <Outlet />
        </div>
    );
}