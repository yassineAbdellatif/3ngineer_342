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

function findConnections(routes, query) {
  const { departure, arrival } = query;

  return routes
    .filter(
      (r) =>
        r['Departure City'] === departure &&
        r['Arrival City'] === arrival
    )
    .map((r) => ({
      routeId: r['Route ID'],
      departure: r['Departure City'],
      arrival: r['Arrival City'],
      departureTime: r['Departure Time'],
      arrivalTime: r['Arrival Time'],
      trainType: r['Train Type'],
      daysOfOperation: r['Days of Operation'],
      firstClassPrice: (r['First Class ticket rate (in euro)']),
      secondClassPrice: (r['Second Class ticket rate (in euro)']),
    }));
}
module.exports = { loadCSVData, findConnections };