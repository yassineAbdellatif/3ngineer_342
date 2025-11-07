import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Cache for the connections catalog
let connectionsCatalog = null;

// --- Load connections catalog from JSON file ---
const loadConnectionsCatalog = async () => {
  if (connectionsCatalog) {
    return connectionsCatalog;
  }

  try {
    const response = await fetch('/connections_catalog.json');
    connectionsCatalog = await response.json();
    console.log(`Loaded ${connectionsCatalog.metadata.totalConnections} connections from catalog`);
    return connectionsCatalog;
  } catch (error) {
    console.error("Error loading connections catalog:", error);
    throw error;
  }
};

// --- Filter connections locally ---
const filterConnections = (catalog, query) => {
  const {
    departure = "",
    arrival = "",
    departureTime = "",
    arrivalTime = "",
    trainType = "",
    daysOfOperation = "",
    firstClassPrice = "",
    secondClassPrice = "",
    maxPrice = "",
    minStops = "",
    maxStops = ""
  } = query;

  let results = [...catalog.connections]; // Start with all connections

  // Normalize city names for case-insensitive comparison
  const normDeparture = departure.toLowerCase().trim();
  const normArrival = arrival.toLowerCase().trim();

  // Filter by departure and/or arrival
  if (normDeparture || normArrival) {
    results = results.filter(conn => {
      const matchesDeparture = !normDeparture || conn.departure.toLowerCase() === normDeparture;
      const matchesArrival = !normArrival || conn.arrival.toLowerCase() === normArrival;
      return matchesDeparture && matchesArrival;
    });
  }

  // Additional filters
  results = results.filter(conn => {
    // Filter by departure time (first segment)
    if (departureTime && conn.segments[0]["Departure Time"] !== departureTime) {
      return false;
    }

    // Filter by arrival time (last segment)
    if (arrivalTime) {
      const lastSegment = conn.segments[conn.segments.length - 1];
      if (lastSegment["Arrival Time"] !== arrivalTime) {
        return false;
      }
    }

    // Filter by train type
    if (trainType && !conn.trainType.toLowerCase().includes(trainType.toLowerCase())) {
      return false;
    }

    // Filter by days of operation
    if (daysOfOperation && !conn.daysOfOperation.toLowerCase().includes(daysOfOperation.toLowerCase())) {
      return false;
    }

    // Filter by first class price (exact match or less than)
    if (firstClassPrice) {
      const price = parseFloat(firstClassPrice);
      if (conn.firstClassPrice > price) {
        return false;
      }
    }

    // Filter by second class price (exact match or less than)
    if (secondClassPrice) {
      const price = parseFloat(secondClassPrice);
      if (conn.secondClassPrice > price) {
        return false;
      }
    }

    // Filter by max price (second class)
    if (maxPrice && conn.secondClassPrice > parseFloat(maxPrice)) {
      return false;
    }

    // Filter by number of stops (segments - 1)
    const stops = conn.segments.length - 1;
    if (minStops && stops < parseInt(minStops)) {
      return false;
    }
    if (maxStops && stops > parseInt(maxStops)) {
      return false;
    }

    return true;
  });

  return results;
};

// --- Search connections using local catalog ---
export const searchConnections = async (query) => {
  try {
    const catalog = await loadConnectionsCatalog();
    const results = filterConnections(catalog, query);
    console.log(`Found ${results.length} connections matching query`);
    return results;
  } catch (error) {
    console.error("Search error", error);
    return [];
  }
};

// --- Get all connections (for catalog/browsing) ---
export const getAllConnections = async () => {
  try {
    const catalog = await loadConnectionsCatalog();
    return catalog.connections;
  } catch (error) {
    console.error("Error getting all connections", error);
    return [];
  }
};

// --- Book a trip ---
export const bookTrip = async (travellers, connection) => {
  try {
    const response = await axios.post(`${API_BASE}/trips/book`, {
      travellers,
      connection,
    });
    return response.data;
  } catch (error) {
    console.error("Booking error", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Booking failed");
  }
};

// --- View trips ---
export const viewTrips = async (lastName, id) => {
  try {
    const response = await axios.get(`${API_BASE}/trips/view`, {
      params: { lastName, id },
    });
    return response.data;
  } catch (error) {
    console.error("View trips error", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to load trips");
  }
};