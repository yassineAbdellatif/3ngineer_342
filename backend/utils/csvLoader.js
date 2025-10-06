const fs = require('fs');
const path = require('path');

// Load CSV synchronously into memory
function loadCSVData() {
  const results = [];
  const filePath = path.join(__dirname, '../data/train_connections.csv');

  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    if (row.length === headers.length) {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h.trim()] = row[idx].trim();
      });
      results.push(obj);
    }
  }

  console.log(`CSV Loaded: ${results.length} rows`);
  return results;
}

// Safely parse time strings to minutes
function parseTime(str) {
  if (!str) return 0;
  const [hours, minutes] = str.split(':').map(Number);
  return hours * 60 + minutes;
}

// Format minutes as "Xh Ym"
function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// Calculate total duration including waiting times
function calculateConnectionDuration(tripSegments) {
  let total = 0;

  for (let i = 0; i < tripSegments.length; i++) {
    const seg = tripSegments[i];
    const dep = parseTime(seg['Departure Time']);
    const arr = parseTime(seg['Arrival Time']);
    total += arr - dep;

    if (i > 0) {
      const prevArr = parseTime(tripSegments[i - 1]['Arrival Time']);
      total += dep - prevArr; // add change time
    }
  }

  return formatDuration(total);
}

// Calculate change times between segments
function calculateChangeTimes(tripSegments) {
  const changeTimes = [];
  for (let i = 1; i < tripSegments.length; i++) {
    const prevArrival = parseTime(tripSegments[i - 1]['Arrival Time']);
    const currDeparture = parseTime(tripSegments[i]['Departure Time']);
    const diff = currDeparture - prevArrival;
    changeTimes.push(diff > 0 ? formatDuration(diff) : '0h 0m');
  }
  return changeTimes;
}

// Find all connections (direct, 1-stop, 2-stop)
function findAllConnections(routes, query) {
  const {
    departure = '',
    arrival = '',
    departureTime = '',
    arrivalTime = '',
    trainType = '',
    daysOfOperation = '',
    firstClassPrice = '',
    secondClassPrice = ''
  } = query;

  const results = [];

  const matches = (r) => {
    return (!departure || r['Departure City'] === departure)
      && (!arrival || r['Arrival City'] === arrival)
      && (!departureTime || r['Departure Time'] === departureTime)
      && (!arrivalTime || r['Arrival Time'] === arrivalTime)
      && (!trainType || r['Train Type'] === trainType)
      && (!daysOfOperation || r['Days of Operation'] === daysOfOperation)
      && (!firstClassPrice || parseFloat(r['First Class ticket rate (in euro)']) == firstClassPrice)
      && (!secondClassPrice || parseFloat(r['Second Class ticket rate (in euro)']) == secondClassPrice);
  };

  // Direct connections
  routes.filter(matches).forEach(r => {
    results.push({
      segments: [r],
      departure: r['Departure City'],
      arrival: r['Arrival City'],
      trainType: r['Train Type'],
      daysOfOperation: r['Days of Operation'],
      firstClassPrice: parseFloat(r['First Class ticket rate (in euro)']),
      secondClassPrice: parseFloat(r['Second Class ticket rate (in euro)']),
      duration: calculateConnectionDuration([r]),
      changeTimes: [], // direct trip → no changes
    });
  });

  // 1-stop connections
  const firstLegs = routes.filter(r => !departure || r['Departure City'] === departure);
  firstLegs.forEach(r1 => {
    const secondLegs = routes.filter(r2 =>
      r2['Departure City'] === r1['Arrival City'] &&
      (!arrival || r2['Arrival City'] === arrival)
    );

    secondLegs.forEach(r2 => {
      if (!trainType || `${r1['Train Type']} → ${r2['Train Type']}`.includes(trainType)) {
        const segments = [r1, r2];
        results.push({
          segments,
          departure: r1['Departure City'],
          arrival: r2['Arrival City'],
          trainType: `${r1['Train Type']} → ${r2['Train Type']}`,
          daysOfOperation: `${r1['Days of Operation']}, ${r2['Days of Operation']}`,
          firstClassPrice: parseFloat(r1['First Class ticket rate (in euro)']) + parseFloat(r2['First Class ticket rate (in euro)']),
          secondClassPrice: parseFloat(r1['Second Class ticket rate (in euro)']) + parseFloat(r2['Second Class ticket rate (in euro)']),
          duration: calculateConnectionDuration(segments),
          changeTimes: calculateChangeTimes(segments),
        });
      }
    });
  });

  // 2-stop connections
  firstLegs.forEach(r1 => {
    const secondLegs = routes.filter(r2 =>
      r2['Departure City'] === r1['Arrival City'] &&
      (!arrival || r2['Arrival City'] !== arrival)
    );

    secondLegs.forEach(r2 => {
      const thirdLegs = routes.filter(r3 =>
        r3['Departure City'] === r2['Arrival City'] &&
        (!arrival || r3['Arrival City'] === arrival)
      );

      thirdLegs.forEach(r3 => {
        if (!trainType || `${r1['Train Type']} → ${r2['Train Type']} → ${r3['Train Type']}`.includes(trainType)) {
          const segments = [r1, r2, r3];
          results.push({
            segments,
            departure: r1['Departure City'],
            arrival: r3['Arrival City'],
            trainType: `${r1['Train Type']} → ${r2['Train Type']} → ${r3['Train Type']}`,
            daysOfOperation: `${r1['Days of Operation']}, ${r2['Days of Operation']}, ${r3['Days of Operation']}`,
            firstClassPrice: parseFloat(r1['First Class ticket rate (in euro)']) + parseFloat(r2['First Class ticket rate (in euro)']) + parseFloat(r3['First Class ticket rate (in euro)']),
            secondClassPrice: parseFloat(r1['Second Class ticket rate (in euro)']) + parseFloat(r2['Second Class ticket rate (in euro)']) + parseFloat(r3['Second Class ticket rate (in euro)']),
            duration: calculateConnectionDuration(segments),
            changeTimes: calculateChangeTimes(segments),
          });
        }
      });
    });
  });

  return results;
}

module.exports = { loadCSVData, findAllConnections };