const fs = require('fs');
const path = require('path');
const { generateTripId, generateTicketId } = require('../utils/idGenerator');

const tripsFilePath = path.join(__dirname, '../data/trips.json');

// --- Helpers to read/write the trips.json file ---

function readTrips() {
  if (!fs.existsSync(tripsFilePath)) return [];
  const data = fs.readFileSync(tripsFilePath, 'utf8');
  return data ? JSON.parse(data) : [];
}

function writeTrips(trips) {
  fs.writeFileSync(tripsFilePath, JSON.stringify(trips, null, 2), 'utf8');
}

// --- POST /api/trips/book ---
function bookTrip(req, res) {
  const { travellers, connection } = req.body;

  if (!travellers || !Array.isArray(travellers) || travellers.length === 0 || !connection) {
    return res.status(400).json({ error: 'Invalid request. Travellers and connection are required.' });
  }

  const trips = readTrips();

  // Prevent duplicate reservation (same traveller & same connection)
  for (const traveller of travellers) {
    const duplicate = trips.some(t =>
      t.reservations.some(r =>
        r.traveller.id === traveller.id &&
        t.connection.departure === connection.departure &&
        t.connection.arrival === connection.arrival
      )
    );

    if (duplicate) {
      return res.status(400).json({
        error: `Traveller ${traveller.name} already has a booking for this connection.`
      });
    }
  }

  // Generate unique trip and ticket IDs
  const tripId = generateTripId();
  const reservations = travellers.map(traveller => ({
    ticketId: generateTicketId(),
    traveller
  }));

  const newTrip = {
    tripId,
    connection,
    reservations,
    bookedAt: new Date().toISOString()
  };

  trips.push(newTrip);
  writeTrips(trips);

  res.status(201).json({
    message: 'Trip successfully booked!',
    trip: newTrip
  });
}

// --- GET /api/trips/view?lastName=Smith&id=12345 ---
function viewTrips(req, res) {
  const { lastName, id } = req.query;
  if (!lastName || !id) {
    return res.status(400).json({ error: 'lastName and id are required.' });
  }

  const trips = readTrips();

  // Filter trips containing this traveller
  const matchedTrips = trips.filter(t =>
    t.reservations.some(r =>
      r.traveller.name.toLowerCase().includes(lastName.toLowerCase()) &&
      r.traveller.id === id
    )
  );

  // Separate current vs past trips (based on connection.departureDate if available)
  const now = new Date();
  const currentTrips = matchedTrips.filter(t =>
    t.connection.departureDate ? new Date(t.connection.departureDate) >= now : true
  );
  const historyTrips = matchedTrips.filter(t =>
    t.connection.departureDate ? new Date(t.connection.departureDate) < now : false
  );

  res.json({ currentTrips, historyTrips });
}

module.exports = { bookTrip, viewTrips };