export const calculateDuration = (departure, arrival) => {
  const start = new Date(`1970-01-01T${departure}:00`);
  const end = new Date(`1970-01-01T${arrival}:00`);
  let diff = (end - start) / (1000 * 60); // minutes
  if (diff < 0) diff += 24 * 60; // handle overnight trips
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};