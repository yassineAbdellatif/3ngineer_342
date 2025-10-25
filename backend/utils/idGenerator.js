function generateTripId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

let nextTicketId = 1;
function generateTicketId() {
  return nextTicketId++;
}

module.exports = { generateTripId, generateTicketId };