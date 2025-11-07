const fs = require('fs');
const path = require('path');
const { loadCSVData, findAllConnections } = require('./csvLoader');

/**
 * Generate a complete catalog of all train connections (direct, 1-stop, 2-stop)
 * and save it as a JSON file for frontend use
 */
function generateConnectionsCatalog() {
  console.log('Loading CSV data...');
  const routes = loadCSVData();
  
  console.log('Generating all possible connections...');
  // Search with empty query to get ALL connections
  const allConnections = findAllConnections(routes, {});
  
  // Organize connections by departure and arrival city for easier lookup
  const catalog = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalConnections: allConnections.length,
      totalRoutes: routes.length
    },
    connections: allConnections,
    // Index by departure city for faster lookups
    byDeparture: {},
    // Index by arrival city for faster lookups
    byArrival: {},
    // Index by departure-arrival pair
    byRoute: {}
  };

  // Build indexes
  allConnections.forEach((conn, index) => {
    const dep = conn.departure;
    const arr = conn.arrival;
    const routeKey = `${dep}-${arr}`;

    // By departure
    if (!catalog.byDeparture[dep]) {
      catalog.byDeparture[dep] = [];
    }
    catalog.byDeparture[dep].push(index);

    // By arrival
    if (!catalog.byArrival[arr]) {
      catalog.byArrival[arr] = [];
    }
    catalog.byArrival[arr].push(index);

    // By route
    if (!catalog.byRoute[routeKey]) {
      catalog.byRoute[routeKey] = [];
    }
    catalog.byRoute[routeKey].push(index);
  });

  // Save to JSON file
  const outputPath = path.join(__dirname, '../data/connections_catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2));
  
  console.log(`Catalog generated successfully!`);
//   console.log(`   Total connections: ${allConnections.length}`);
//   console.log(`   Unique departure cities: ${Object.keys(catalog.byDeparture).length}`);
//   console.log(`   Unique arrival cities: ${Object.keys(catalog.byArrival).length}`);
//   console.log(`   Unique routes: ${Object.keys(catalog.byRoute).length}`);
//   console.log(`   Output file: ${outputPath}`);
  
  return catalog;
}

// Run if called directly
if (require.main === module) {
  generateConnectionsCatalog();
}

module.exports = { generateConnectionsCatalog };
