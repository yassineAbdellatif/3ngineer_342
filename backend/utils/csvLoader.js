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
      .map((r) => {
        const depTime = r['Departure Time'];
        const arrTime = r['Arrival Time'];

        return {
          routeId: r['Route ID'],
          departure: r['Departure City'],
          arrival: r['Arrival City'],
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: calculateDuration(depTime, arrTime), // <-- add duration here
          trainType: r['Train Type'],
          daysOfOperation: r['Days of Operation'],
          firstClassPrice: parseFloat(r['First Class ticket rate (in euro)']),
          secondClassPrice: parseFloat(r['Second Class ticket rate (in euro)']),
        };
      });
      }

      function calculateDuration(departureTime, arrivalTime) {
  if (!departureTime || !arrivalTime) return 'N/A';

  const [depHour, depMin] = departureTime.split(':').map(Number);
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number);

  let depDate = new Date(0, 0, 0, depHour, depMin);
  let arrDate = new Date(0, 0, 0, arrHour, arrMin);

  // Handle trips that arrive past midnight
  if (arrDate < depDate) arrDate.setDate(arrDate.getDate() + 1);

  const diffMs = arrDate - depDate;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHours}h ${diffMins}m`;
}
module.exports = { loadCSVData, findConnections };