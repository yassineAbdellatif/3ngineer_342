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
  return routes
    .filter((r) => {
      // Go through every key in the query object
      for (let key in query) {
        if (!query[key]) continue; // skip empty search fields

        const value = query[key].toLowerCase();
        
        // Map query keys to your backend keys
        switch (key) {
          case 'departure':
            if (!r['Departure City'].toLowerCase().includes(value)) return false;
            break;
          case 'arrival':
            if (!r['Arrival City'].toLowerCase().includes(value)) return false;
            break;
          case 'departureTime':
            if (!r['Departure Time'].toLowerCase().includes(value)) return false;
            break;
          case 'arrivalTime':
            if (!r['Arrival Time'].toLowerCase().includes(value)) return false;
            break;
          case 'trainType':
            if (!r['Train Type'].toLowerCase().includes(value)) return false;
            break;
          case 'daysOfOperation':
            if (!r['Days of Operation'].toLowerCase().includes(value)) return false;
            break;
          case 'firstClassPrice':
            if (parseFloat(r['First Class ticket rate (in euro)']) !== parseFloat(value)) return false;
            break;
          case 'secondClassPrice':
            if (parseFloat(r['Second Class ticket rate (in euro)']) !== parseFloat(value)) return false;
            break;
          default:
            break;
        }
      }
      return true;
    })
    .map((r) => ({
      routeId: r['Route ID'],
      departure: r['Departure City'],
      arrival: r['Arrival City'],
      departureTime: r['Departure Time'],
      arrivalTime: r['Arrival Time'],
      duration: calculateDuration(r['Departure Time'], r['Arrival Time']),
      trainType: r['Train Type'],
      daysOfOperation: r['Days of Operation'],
      firstClassPrice: parseFloat(r['First Class ticket rate (in euro)']),
      secondClassPrice: parseFloat(r['Second Class ticket rate (in euro)']),
    }));
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