const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

function loadCSVData() {
  const results = [];
  const filePath = path.join(__dirname, '../data/train_connections.csv');
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => console.log('CSV Loaded'));

  return results;
}

// Example search function
function findConnections(routes, query) {
  return routes.filter(route => {
    let match = true;
    if (query.departure) match = match && route['Departure City'] === query.departure;
    if (query.arrival) match = match && route['Arrival City'] === query.arrival;
    return match;
  });
}

module.exports = { loadCSVData, findConnections };