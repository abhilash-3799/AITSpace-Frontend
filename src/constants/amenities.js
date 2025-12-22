// src/constants/amenities.js
export const AMENITIES = [
  { id: 'tv', name: 'TV Screen', icon: 'Tv' },
  { id: 'video', name: 'Video Conference', icon: 'Video' },
  { id: 'wifi', name: 'WiFi', icon: 'Wifi' },
  { id: 'projector', name: 'Projector', icon: 'Projector' },
  { id: 'whiteboard', name: 'Whiteboard', icon: 'Clipboard' },
  { id: 'phone', name: 'Conference Phone', icon: 'Phone' },
  { id: 'camera', name: 'Camera', icon: 'Camera' },
  { id: 'ac', name: 'Air Conditioning', icon: 'Wind' },
  { id: 'coffee', name: 'Coffee Machine', icon: 'Coffee' }
];

export const getAmenityName = (id) => {
  const amenity = AMENITIES.find(a => a.id === id);
  return amenity ? amenity.name : id;
};