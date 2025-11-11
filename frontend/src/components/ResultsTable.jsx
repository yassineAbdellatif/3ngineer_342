import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

/**
 * Check if layover time is valid based on time of day
 */
function isValidLayover(arrivalTime, departureTime) {
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
  const [depHour, depMin] = departureTime.split(':').map(Number);
  
  // Convert to minutes since midnight
  const arrivalMinutes = arrHour * 60 + arrMin;
  let departureMinutes = depHour * 60 + depMin;
  
  // Handle next day scenario
  if (departureMinutes < arrivalMinutes) {
    departureMinutes += 24 * 60;
  }
  
  // Calculate layover in minutes
  const layoverMinutes = departureMinutes - arrivalMinutes;
  
  // Check time of day (6am = 6, 10pm = 22)
  const isDaytime = (arrHour >= 6 && arrHour < 22);
  
  if (isDaytime) {
    // Between 6am and 10pm: max 2 hours (120 minutes)
    return layoverMinutes <= 120;
  } else {
    // Between 10pm and 6am: max 30 minutes
    return layoverMinutes <= 30;
  }
}

/**
 * Validate all layovers in a trip
 */
function hasValidLayovers(trip) {
  // If single segment, no layover to check
  if (!trip.segments || trip.segments.length <= 1) {
    return true;
  }
  
  // Check each connection point
  for (let i = 0; i < trip.segments.length - 1; i++) {
    const currentSegment = trip.segments[i];
    const nextSegment = trip.segments[i + 1];
    
    const arrivalTime = currentSegment["Arrival Time"] || currentSegment.arrivalTime;
    const departureTime = nextSegment["Departure Time"] || nextSegment.departureTime;
    
    if (!isValidLayover(arrivalTime, departureTime)) {
      return false;
    }
  }
  
  return true;
}

export default function ResultsTable({ results, onSelect }) {
  const [orderBy, setOrderBy] = useState('duration');
  const [order, setOrder] = useState('asc');

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const parseDuration = (str) => {
    if (!str) return 0;
    const match = str.match(/(\d+)h (\d+)m/);
    return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
  };

  // Filter results to only include trips with valid layovers
  const filteredResults = results.filter(trip => hasValidLayovers(trip));

  const sortedResults = [...filteredResults].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (orderBy === 'duration') {
      valA = parseDuration(valA);
      valB = parseDuration(valB);
    }

    return order === 'asc' ? valA - valB : valB - valA;
  });

  if (!results || results.length === 0) return <p>No trips found</p>;
  if (filteredResults.length === 0) return <p>No trips found with valid layover times</p>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {/* keep your existing TableHead */}
        </TableHead>
        <TableBody>
          {sortedResults.map((trip, idx) => {
            const firstSeg = trip.segments[0];
            const lastSeg = trip.segments[trip.segments.length - 1];
            const changeTimesDisplay =
              trip.changeTimes.length > 0
                ? trip.changeTimes.join(" | ")
                : "-";

            return (
              <TableRow
                key={idx}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => onSelect && onSelect(trip)}
              >
                <TableCell>{firstSeg["Departure City"]}</TableCell>
                <TableCell>{lastSeg["Arrival City"]}</TableCell>
                <TableCell>{firstSeg["Departure Time"]}</TableCell>
                <TableCell>{lastSeg["Arrival Time"]}</TableCell>
                <TableCell>{trip.duration}</TableCell>
                <TableCell>{trip.trainType}</TableCell>
                <TableCell>{trip.daysOfOperation}</TableCell>
                <TableCell>{trip.firstClassPrice}</TableCell>
                <TableCell>{trip.secondClassPrice}</TableCell>
                <TableCell>{changeTimesDisplay}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}