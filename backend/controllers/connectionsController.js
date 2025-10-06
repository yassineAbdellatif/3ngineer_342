const { loadCSVData, findConnections } = require('../utils/csvLoader');

// Load CSV once at server startup
const routes = loadCSVData();

function searchConnections(req, res) {
    const query = req.query; // e.g., ?departure=Paris&arrival=Berlin
    const results = findConnections(routes, query);
    res.json(results);
}

module.exports = { searchConnections };