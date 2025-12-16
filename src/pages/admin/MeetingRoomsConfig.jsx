import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Building, Save, X } from "lucide-react";

export default function MeetingRoomsConfig() {
  const [offices, setOffices] = useState([]);
  const [activeOffice, setActiveOffice] = useState(null);
  const [showOfficeModal, setShowOfficeModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingOffice, setEditingOffice] = useState(null);


  const [officeForm, setOfficeForm] = useState({
    id: "",
    name: "",
    address: "",
    floors: 1,
    totalRooms: 0,
    description: ""
  });

  // Room form state
  const [roomForm, setRoomForm] = useState({
    id: "",
    name: "",
    floor: "1",
    capacity: "Up to 4 people",
    description: "",
    tags: [],
    amenities: [],
    availability: 100,
    isActive: true
  });

  // Available amenities
  const availableAmenities = [
    { id: "tv", name: "TV Screen", icon: "Tv" },
    { id: "video", name: "Video Conference", icon: "Video" },
    { id: "wifi", name: "WiFi", icon: "Wifi" },
    { id: "projector", name: "Projector", icon: "Projector" },
    { id: "whiteboard", name: "Whiteboard", icon: "Clipboard" },
    { id: "phone", name: "Conference Phone", icon: "Phone" },
    { id: "camera", name: "Camera", icon: "Camera" },
    { id: "ac", name: "Air Conditioning", icon: "Wind" },
    { id: "coffee", name: "Coffee Machine", icon: "Coffee" }
  ];

  // Load offices from localStorage
  useEffect(() => {
    const savedOffices = JSON.parse(localStorage.getItem("officeConfigs")) || [];
    setOffices(savedOffices);
    if (savedOffices.length > 0 && !activeOffice) {
      setActiveOffice(savedOffices[0]);
    }
  }, []);

  // Save offices to localStorage
  const saveOffices = (updatedOffices) => {
    localStorage.setItem("officeConfigs", JSON.stringify(updatedOffices));
    setOffices(updatedOffices);
  };

  // Handle office creation/editing
  const handleSaveOffice = () => {
    if (!officeForm.name.trim()) {
      alert("Please enter office name");
      return;
    }

    if (editingOffice) {
      // Update existing office
      const updatedOffices = offices.map(office => 
        office.id === editingOffice.id ? { ...officeForm, rooms: office.rooms } : office
      );
      saveOffices(updatedOffices);
      
      // Update active office if it was the one being edited
      if (activeOffice?.id === editingOffice.id) {
        setActiveOffice({ ...officeForm, rooms: activeOffice.rooms });
      }
    } else {
      // Create new office
      const newOffice = {
        ...officeForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        rooms: []
      };

      const updatedOffices = [...offices, newOffice];
      saveOffices(updatedOffices);
      setActiveOffice(newOffice);
    }
    
    // Reset form and close modal
    setOfficeForm({
      id: "",
      name: "",
      address: "",
      floors: 1,
      totalRooms: 0,
      description: ""
    });
    setEditingOffice(null);
    setShowOfficeModal(false);
  };

  // Handle office edit
  const handleEditOffice = (office) => {
    setOfficeForm({
      id: office.id,
      name: office.name,
      address: office.address || "",
      floors: office.floors || 1,
      totalRooms: office.totalRooms || 0,
      description: office.description || ""
    });
    setEditingOffice(office);
    setShowOfficeModal(true);
  };

  // Handle office delete
  const handleDeleteOffice = (officeId) => {
    if (!window.confirm("Are you sure you want to delete this office? All rooms in this office will be deleted.")) return;

    const updatedOffices = offices.filter(office => office.id !== officeId);
    
    if (activeOffice?.id === officeId) {
      setActiveOffice(updatedOffices.length > 0 ? updatedOffices[0] : null);
    }

    saveOffices(updatedOffices);
  };

  // Handle room creation/editing
  const handleSaveRoom = () => {
    if (!roomForm.name.trim() || !roomForm.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const roomToSave = {
      ...roomForm,
      id: roomForm.id || Date.now().toString()
    };

    const updatedOffices = offices.map(office => {
      if (office.id === activeOffice.id) {
        let updatedRooms;
        
        if (editingRoom) {
          // Update existing room
          updatedRooms = office.rooms.map(room => 
            room.id === editingRoom.id ? roomToSave : room
          );
        } else {
          // Add new room
          updatedRooms = [...office.rooms, roomToSave];
        }

        return {
          ...office,
          rooms: updatedRooms,
          totalRooms: updatedRooms.length
        };
      }
      return office;
    });

    saveOffices(updatedOffices);
    
    // Update active office
    const updatedActive = updatedOffices.find(o => o.id === activeOffice.id);
    setActiveOffice(updatedActive);
    
    // Reset form
    setRoomForm({
      id: "",
      name: "",
      floor: "1",
      capacity: "Up to 4 people",
      description: "",
      tags: [],
      amenities: [],
      availability: 100,
      isActive: true
    });
    setEditingRoom(null);
    setShowRoomModal(false);
  };

  // Handle room edit
  const handleEditRoom = (room) => {
    setRoomForm(room);
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  // Handle room delete
  const handleDeleteRoom = (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    const updatedOffices = offices.map(office => {
      if (office.id === activeOffice.id) {
        const updatedRooms = office.rooms.filter(room => room.id !== roomId);
        return {
          ...office,
          rooms: updatedRooms,
          totalRooms: updatedRooms.length
        };
      }
      return office;
    });

    saveOffices(updatedOffices);
    const updatedActive = updatedOffices.find(o => o.id === activeOffice.id);
    setActiveOffice(updatedActive);
  };

  // Handle amenity toggle
  const toggleAmenity = (amenityId) => {
    setRoomForm(prev => {
      const isSelected = prev.amenities.includes(amenityId);
      if (isSelected) {
        return {
          ...prev,
          amenities: prev.amenities.filter(id => id !== amenityId)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenityId]
        };
      }
    });
  };

  // Get amenity name by ID
  const getAmenityName = (id) => {
    const amenity = availableAmenities.find(a => a.id === id);
    return amenity ? amenity.name : id;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meeting Rooms Configuration</h1>
          <p className="text-gray-600 mt-2">Admin panel for setting up office spaces and meeting rooms</p>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Offices List */}
          <div className="w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Offices</h2>
                <button
                  onClick={() => {
                    setEditingOffice(null);
                    setOfficeForm({
                      id: "",
                      name: "",
                      address: "",
                      floors: 1,
                      totalRooms: 0,
                      description: ""
                    });
                    setShowOfficeModal(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Plus size={16} />
                  Add Office
                </button>
              </div>

              <div className="space-y-2">
                {offices.map(office => (
                  <div
                    key={office.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors group relative ${
                      activeOffice?.id === office.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveOffice(office)}
                  >
                    <div className="flex items-center gap-2">
                      <Building size={18} className="text-gray-600" />
                      <div className="flex-1">
                        <h3 className="font-medium">{office.name}</h3>
                        <p className="text-sm text-gray-500">
                          {office.rooms?.length || 0} rooms • {office.floors} floors
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditOffice(office);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit office"
                        >
                          <Edit size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOffice(office.id);
                          }}
                          className="p-1 hover:bg-red-50 rounded"
                          title="Delete office"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            {activeOffice && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold mb-3">{activeOffice.name} Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rooms</span>
                    <span className="font-medium">{activeOffice.rooms?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floors</span>
                    <span className="font-medium">{activeOffice.floors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Rooms</span>
                    <span className="font-medium">
                      {activeOffice.rooms?.filter(r => r.isActive).length || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Rooms Management */}
          <div className="flex-1">
            {activeOffice ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{activeOffice.name}</h2>
                    <p className="text-gray-600">{activeOffice.address}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRoom(null);
                      setRoomForm({
                        id: "",
                        name: "",
                        floor: "1",
                        capacity: "Up to 4 people",
                        description: "",
                        tags: [],
                        amenities: [],
                        availability: 100,
                        isActive: true
                      });
                      setShowRoomModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={18} />
                    Add Room
                  </button>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeOffice.rooms?.map(room => (
                    <div
                      key={room.id}
                      className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{room.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <span>Floor {room.floor}</span>
                            <span>•</span>
                            <span>{room.capacity}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRoom(room)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Edit room"
                          >
                            <Edit size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1 hover:bg-red-50 rounded"
                            title="Delete room"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {room.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {room.amenities?.slice(0, 3).map(amenityId => (
                          <span
                            key={amenityId}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                          >
                            {getAmenityName(amenityId)}
                          </span>
                        ))}
                        {room.amenities?.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                          {room.isActive ? 'Active' : 'Inactive'}
                        </div>
                        <div className="text-sm font-medium">
                          {room.availability}% available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {(!activeOffice.rooms || activeOffice.rooms.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <Building size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No rooms configured yet</p>
                    <p className="text-sm mt-1">Add your first meeting room to get started</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Building size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Office Selected
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first office or select an existing one to manage meeting rooms
                </p>
                <button
                  onClick={() => setShowOfficeModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Create New Office
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Office Creation/Edit Modal */}
        {showOfficeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingOffice ? 'Edit Office' : 'Create New Office'}
                </h3>
                <button
                  onClick={() => {
                    setShowOfficeModal(false);
                    setEditingOffice(null);
                    setOfficeForm({
                      id: "",
                      name: "",
                      address: "",
                      floors: 1,
                      totalRooms: 0,
                      description: ""
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Name *
                  </label>
                  <input
                    type="text"
                    value={officeForm.name}
                    onChange={(e) => setOfficeForm({...officeForm, name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., New York Headquarters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={officeForm.address}
                    onChange={(e) => setOfficeForm({...officeForm, address: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., 123 Main St, New York, NY"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Floors
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={officeForm.floors}
                      onChange={(e) => setOfficeForm({...officeForm, floors: parseInt(e.target.value) || 1})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Rooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={officeForm.totalRooms}
                      onChange={(e) => setOfficeForm({...officeForm, totalRooms: parseInt(e.target.value) || 0})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={officeForm.description}
                    onChange={(e) => setOfficeForm({...officeForm, description: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                    placeholder="Brief description of this office location..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowOfficeModal(false);
                    setEditingOffice(null);
                    setOfficeForm({
                      id: "",
                      name: "",
                      address: "",
                      floors: 1,
                      totalRooms: 0,
                      description: ""
                    });
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOffice}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingOffice ? 'Update Office' : 'Save Office'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Room Creation/Edit Modal */}
        {showRoomModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingRoom ? 'Edit Room' : 'Create New Room'}
                </h3>
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Name *
                    </label>
                    <input
                      type="text"
                      value={roomForm.name}
                      onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., Boardroom A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor *
                    </label>
                    <select
                      value={roomForm.floor}
                      onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {Array.from({ length: activeOffice?.floors || 1 }, (_, i) => i + 1).map(floor => (
                        <option key={floor} value={floor}>Floor {floor}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <select
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="Up to 2 people">Up to 2 people</option>
                    <option value="Up to 4 people">Up to 4 people</option>
                    <option value="Up to 6 people">Up to 6 people</option>
                    <option value="Up to 8 people">Up to 8 people</option>
                    <option value="Up to 12 people">Up to 12 people</option>
                    <option value="Up to 16 people">Up to 16 people</option>
                    <option value="Up to 20 people">Up to 20 people</option>
                    <option value="Up to 30 people">Up to 30 people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={roomForm.description}
                    onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                    placeholder="Describe this meeting room..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Amenities & Equipment
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableAmenities.map(amenity => (
                      <div
                        key={amenity.id}
                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          roomForm.amenities.includes(amenity.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleAmenity(amenity.id)}
                      >
                        <input
                          type="checkbox"
                          checked={roomForm.amenities.includes(amenity.id)}
                          onChange={() => {}}
                          className="rounded"
                        />
                        <span className="text-sm">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability %
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={roomForm.availability}
                      onChange={(e) => setRoomForm({...roomForm, availability: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="text-center text-sm font-medium mt-1">
                      {roomForm.availability}%
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={roomForm.isActive}
                          onChange={() => setRoomForm({...roomForm, isActive: true})}
                          className="text-blue-600"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={!roomForm.isActive}
                          onChange={() => setRoomForm({...roomForm, isActive: false})}
                          className="text-blue-600"
                        />
                        <span className="text-sm">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRoom}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}