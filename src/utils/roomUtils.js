

export const parseCapacity = (capacityText) => {
  const num = capacityText.match(/\d+/);
  return num ? Number(num[0]) : 0;
};

export const getAttendeeRange = (attendees) => {
  const parts = attendees.split("-");
  if (parts.length === 2) return [Number(parts[0]), Number(parts[1])];
  return [Number(parts[0]), 999];
};

export const formatDateForSchedule = (dateString) => {
  const dateObj = new Date(dateString);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
};

export const getDefaultDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};