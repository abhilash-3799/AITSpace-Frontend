import { useState, useEffect, useRef } from "react";
import { UploadCloud, Trash2 } from "lucide-react";

export default function FloorPlanManagement() {
  const [branch, setBranch] = useState("Main Office");
  const [floor, setFloor] = useState("Floor 1");
  const [imagePreview, setImagePreview] = useState(null);
  const [floorPlans, setFloorPlans] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("floorPlans") || "[]");
    setFloorPlans(saved);
  }, []);

  // Handle Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG or JPG format allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newPlan = {
        id: Date.now(),
        branch,
        floor,
        image: reader.result,
      };

      const updatedPlans = [...floorPlans, newPlan];
      setFloorPlans(updatedPlans);
      localStorage.setItem("floorPlans", JSON.stringify(updatedPlans));
      setImagePreview(null);
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePlan = (id) => {
    const updated = floorPlans.filter((p) => p.id !== id);
    setFloorPlans(updated);
    localStorage.setItem("floorPlans", JSON.stringify(updated));
  };

  return (
    <div className="p-8">
      
      <h1 className="text-2xl font-semibold mb-1">Floor Plan Management</h1>
      <p className="text-gray-500 mb-8">
        Upload and manage floor plans for each branch and floor
      </p>

      {/* Select Branch & Floor */}
      <div className="bg-white p-6 rounded-2xl border mb-8">
        <h3 className="font-medium mb-4">Select Branch & Floor</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option>Main Office</option>
              <option>Pune Office</option>
              <option>Bangalore Office</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Floor</label>
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option>Floor 1</option>
              <option>Floor 2</option>
              <option>Floor 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload Floor Plan */}
      <div className="bg-white p-6 rounded-2xl border mb-8">
        <h3 className="font-medium mb-4">Upload Floor Plan Image</h3>

        <div
          className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center 
          justify-center cursor-pointer hover:bg-gray-50"
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud size={40} className="text-gray-400" />
          <p className="text-gray-600 mt-4">Click to upload floor plan</p>
          <p className="text-gray-400 text-sm">JPG or PNG format (max 5MB)</p>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Existing Floor Plans */}
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="font-medium mb-4">Existing Floor Plans</h3>

        {floorPlans.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No floor plans uploaded yet. Upload your first floor plan to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {floorPlans.map((plan) => (
              <div key={plan.id} className="relative border rounded-xl overflow-hidden">
                <img src={plan.image} alt="floor plan" className="w-full h-40 object-cover" />

                <div className="p-3">
                  <p className="font-medium">{plan.branch}</p>
                  <p className="text-gray-500 text-sm">{plan.floor}</p>
                </div>

                <button
                  onClick={() => handleRemovePlan(plan.id)}
                  className="absolute top-2 right-2 bg-white shadow p-1 rounded-full"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
