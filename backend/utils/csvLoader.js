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

function parseDayTime(str) {
  if (!str || typeof str !== "string") return null;
  const m = str.match(/^\s*(\d{1,2})[:h](\d{2})\s*(?:\(?\+\s*(\d+)\s*d\)?)?\s*$/i);
  if (!m) return null;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const offset = m[3] ? parseInt(m[3], 10) : null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return { minutesOfDay: hh * 60 + mm, explicitOffset: offset };
}

// Build absolute times (minutes since start) for each segment
function buildAbsoluteTimes(segments) {
  const DAY = 24 * 60;
  const result = [];
  let prevAbsArrival = null;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const depT = parseDayTime(seg["Departure Time"]);
    const arrT = parseDayTime(seg["Arrival Time"]);
    if (!depT || !arrT) return null;

    // Choose departure offset
    let depOffset = depT.explicitOffset ?? 0;
    if (prevAbsArrival !== null) {
      const prevDay = Math.floor(prevAbsArrival / DAY);
      const prevMin = prevAbsArrival % DAY;
      if (depT.explicitOffset === null) {
        depOffset = prevDay + (depT.minutesOfDay < prevMin ? 1 : 0);
      } else if (depOffset < prevDay || (depOffset === prevDay && depT.minutesOfDay < prevMin)) {
        depOffset = prevDay + 1;
      }
    }

    const depAbs = depOffset * DAY + depT.minutesOfDay;

    // Choose arrival offset
    let arrOffset = arrT.explicitOffset ?? depOffset;
    let arrAbs = arrOffset * DAY + arrT.minutesOfDay;
    while (arrAbs < depAbs) {
      arrOffset++;
      arrAbs = arrOffset * DAY + arrT.minutesOfDay;
    }

    result.push({ depAbs, arrAbs });
    prevAbsArrival = arrAbs;
  }

  return result;
}

// Format duration in minutes -> "Xh Ym"
function formatDuration(mins) {
  if (mins == null || isNaN(mins)) return "NA";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

// Format arrival with +Xd based on total duration
function formatArrivalWithDays(depAbs, arrAbs, rawTime) {
  const DAY = 24 * 60;
  const dayDiff = Math.floor((arrAbs - depAbs) / DAY);
  return dayDiff > 0 ? `${rawTime} (+${dayDiff}d)` : rawTime;
}

// Calculate total duration including waiting times
function calculateConnectionDuration(segments) {
  const abs = buildAbsoluteTimes(segments);
  if (!abs) return "NA";

  let total = 0;
  for (let i = 0; i < abs.length; i++) {
    const seg = abs[i];
    total += seg.arrAbs - seg.depAbs; // travel time
    if (i > 0) {
      const wait = abs[i].depAbs - abs[i - 1].arrAbs;
      total += Math.max(wait, 0);
    }
  }
  return formatDuration(total);
}

// Calculate waiting times (in minutes) between segments and return formatted strings
function calculateChangeTimes(segments) {
  const abs = buildAbsoluteTimes(segments);
  if (!abs) return [];
  const waits = [];
  for (let i = 1; i < abs.length; i++) {
    waits.push(Math.max(abs[i].depAbs - abs[i - 1].arrAbs, 0));
  }
  return waits.map(w => formatDuration(w));
}

function findAllConnections(routes, query) {
  const {
    departure = "",
    arrival = "",
    departureTime = "",
    arrivalTime = "",
    trainType = "",
    daysOfOperation = "",
    firstClassPrice = "",
    secondClassPrice = ""
  } = query;

  const results = [];

  const matches = (r) => {
    return (!departure || r["Departure City"] === departure)
      && (!arrival || r["Arrival City"] === arrival)
      && (!departureTime || r["Departure Time"] === departureTime)
      && (!arrivalTime || r["Arrival Time"] === arrivalTime)
      && (!trainType || r["Train Type"] === trainType)
      && (!daysOfOperation || r["Days of Operation"] === daysOfOperation)
      && (!firstClassPrice || parseFloat(r["First Class ticket rate (in euro)"]) == firstClassPrice)
      && (!secondClassPrice || parseFloat(r["Second Class ticket rate (in euro)"]) == secondClassPrice);
  };

  const addConnection = (segments) => {
    const abs = buildAbsoluteTimes(segments);
    if (!abs) return;

    const firstDepAbs = abs[0].depAbs;
    const lastArrAbs = abs[abs.length - 1].arrAbs;
    const arrivalRaw = segments[segments.length - 1]["Arrival Time"];
    const arrivalWithDays = formatArrivalWithDays(firstDepAbs, lastArrAbs, arrivalRaw);

    results.push({
      segments,
      departure: segments[0]["Departure City"],
      arrival: segments[segments.length - 1]["Arrival City"],
      trainType: segments.map(s => s["Train Type"]).join(" → "),
      daysOfOperation: segments.map(s => s["Days of Operation"]).join(", "),
      firstClassPrice: segments.reduce((sum, s) => sum + parseFloat(s["First Class ticket rate (in euro)"] || 0), 0),
      secondClassPrice: segments.reduce((sum, s) => sum + parseFloat(s["Second Class ticket rate (in euro)"] || 0), 0),
      duration: calculateConnectionDuration(segments),
      changeTimes: calculateChangeTimes(segments),
      arrivalTimeWithDays: arrivalWithDays
    });
  };

  // Direct connections
  routes.filter(matches).forEach(r => addConnection([r]));

  // 1-stop connections
  const firstLegs = routes.filter(r => !departure || r["Departure City"] === departure);
  firstLegs.forEach(r1 => {
    const secondLegs = routes.filter(r2 =>
      r2["Departure City"] === r1["Arrival City"] &&
      (!arrival || r2["Arrival City"] === arrival)
    );
    secondLegs.forEach(r2 => addConnection([r1, r2]));
  });

  // 2-stop connections
  firstLegs.forEach(r1 => {
    const secondLegs = routes.filter(r2 =>
      r2["Departure City"] === r1["Arrival City"] &&
      (!arrival || r2["Arrival City"] !== arrival)
    );
    secondLegs.forEach(r2 => {
      const thirdLegs = routes.filter(r3 =>
        r3["Departure City"] === r2["Arrival City"] &&
        (!arrival || r3["Arrival City"] === arrival)
      );
      thirdLegs.forEach(r3 => addConnection([r1, r2, r3]));
    });
  });

  return results;
}

module.exports = { loadCSVData, findAllConnections };