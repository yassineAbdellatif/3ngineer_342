let nextTripId = 1;

function generateTripId() {
  return nextTripId++;
}

let nextTicketId = 1;
function generateTicketId() {
  return nextTicketId++;
}

module.exports = { generateTripId, generateTicketId };