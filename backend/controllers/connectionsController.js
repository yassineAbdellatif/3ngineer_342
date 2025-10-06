const { loadCSVData, findAllConnections } = require('../utils/csvLoader');

// Load CSV once at server startup
const routes = loadCSVData();

function searchConnections(req, res) {
    const query = req.query; // e.g., ?departure=Paris&arrival=Berlin
    const results = findAllConnections(routes, query);
console.log('Results sent to frontend:', JSON.stringify(results, null, 2));
    res.json(results);
}

module.exports = { searchConnections };