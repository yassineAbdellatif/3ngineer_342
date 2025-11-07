const fs = require('fs');
const path = require('path');

/**
 * Load the pre-generated connections catalog from JSON
 */
function loadConnectionsCatalog() {
  const filePath = path.join(__dirname, '../data/connections_catalog.json');
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const catalog = JSON.parse(data);
    console.log(`Connections catalog loaded: ${catalog.metadata.totalConnections} connections`);
    return catalog;
  } catch (error) {
    console.error('Error loading connections catalog:', error.message);
    throw error;
  }
}

/**
 * Filter connections based on search query
 */
function filterConnections(catalog, query) {
  const {
    departure = "",
    arrival = "",
    trainType = "",
    daysOfOperation = "",
    maxPrice = "",
    minStops = "",
    maxStops = ""
  } = query;

  let results = catalog.connections;

  // Filter by departure city
  if (departure) {
    const indices = catalog.byDeparture[departure] || [];
    results = results.filter((_, idx) => indices.includes(idx));
  }

  // Filter by arrival city
  if (arrival) {
    const indices = catalog.byArrival[arrival] || [];
    results = results.filter((_, idx) => indices.includes(idx));
  }

  // If both departure and arrival are specified, use the route index for efficiency
  if (departure && arrival) {
    const routeKey = `${departure}-${arrival}`;
    const indices = catalog.byRoute[routeKey] || [];
    results = indices.map(idx => catalog.connections[idx]);
  }

  // Additional filters
  results = results.filter(conn => {
    // Filter by train type
    if (trainType && !conn.trainType.includes(trainType)) {
      return false;
    }

    // Filter by days of operation
    if (daysOfOperation && !conn.daysOfOperation.includes(daysOfOperation)) {
      return false;
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
}

module.exports = { loadConnectionsCatalog, filterConnections };
