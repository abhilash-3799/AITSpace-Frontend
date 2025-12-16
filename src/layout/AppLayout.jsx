import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
