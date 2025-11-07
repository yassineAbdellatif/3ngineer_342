const { loadConnectionsCatalog, filterConnections } = require('../utils/jsonLoader');

// Load connections catalog once at server startup
const connectionsCatalog = loadConnectionsCatalog();

function searchConnections(req, res) {
    const query = req.query; // e.g., ?departure=Paris&arrival=Berlin
    const results = filterConnections(connectionsCatalog, query);
    console.log('Results sent to frontend:', JSON.stringify(results, null, 2));
    res.json(results);
}

module.exports = { searchConnections };