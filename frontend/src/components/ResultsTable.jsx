import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel
} from '@mui/material';
import { useState } from 'react';

export default function ResultsTable({ results }) {
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

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const cleanTimeStr = timeStr.replace('(+1d)', '').trim();
    const [hours, minutes] = cleanTimeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const calculateDuration = (start, end) => {
    const startMins = parseTime(start);
    const endMins = parseTime(end);
    const hasNextDay = end.includes('(+1d)');

    if (hasNextDay) {
      return (24 * 60 - startMins) + endMins;
    } else {
    return endMins >= startMins ? endMins - startMins : (24 * 60 - startMins) + endMins;
    }
  }

  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  }

  const isValidTrip = (trip) => {
    if (!trip || !trip.segments || trip.segments.length === 0) return false;
    const firstSeg = trip.segments[0];
    const lastSeg = trip.segments[trip.segments.length - 1];
    if (!firstSeg['Departure Time'] || !lastSeg['Arrival Time']) return false;

    const departureTime = firstSeg['Departure Time'];
    const arrivalTime = lastSeg['Arrival Time'];
    const hasNextDay = arrivalTime.includes('(+1d)');
    
    if (hasNextDay) {
      return true;
    }

    const depMins = parseTime(departureTime);
    const arrMins = parseTime(arrivalTime);
    
    return arrMins >= depMins;
  }

  const validResults = results.filter(isValidTrip);

  const sortedResults = [...validResults].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (!valA || valA === '-') {
        const firstSegA = a.segments[0];
        const lastSegA = a.segments[a.segments.length - 1];
        valA = calculateDuration(firstSegA['Departure Time'], lastSegA['Arrival Time']);
      } else {
        valA = parseDuration(valA);
      }

      if (!valB || valB === '-') {
        const firstSegB = b.segments[0];
        const lastSegB = b.segments[b.segments.length - 1];
        valB = calculateDuration(firstSegB['Departure Time'], lastSegB['Arrival Time']);
      } else {
        valB = parseDuration(valB);
      }

    if (typeof valA === 'string' && !isNaN(parseFloat(valA))) {
      valA = parseFloat(valA);
    }
    if (typeof valB === 'string' && !isNaN(parseFloat(valB))) {
      valB = parseFloat(valB);
    }

    return order === 'asc' ? valA - valB : valB - valA;
  });

  if (!validResults || validResults.length === 0) return <p>No trips found</p>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Departure</TableCell>
            <TableCell>Arrival</TableCell>
            <TableCell>Departure Time</TableCell>
            <TableCell>Arrival Time</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'duration'}
                direction={orderBy === 'duration' ? order : 'asc'}
                onClick={() => handleSort('duration')}
              >
                Duration
              </TableSortLabel>
            </TableCell>
            <TableCell>Train Type</TableCell>
            <TableCell>Days of Operation</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'firstClassPrice'}
                direction={orderBy === 'firstClassPrice' ? order : 'asc'}
                onClick={() => handleSort('firstClassPrice')}
              >
                1st Class (€)
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'secondClassPrice'}
                direction={orderBy === 'secondClassPrice' ? order : 'asc'}
                onClick={() => handleSort('secondClassPrice')}
              >
                2nd Class (€)
              </TableSortLabel>
            </TableCell>
            <TableCell>Change Time(s)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((trip, idx) => {
            const firstSeg = trip.segments[0];
            const lastSeg = trip.segments[trip.segments.length - 1];
            const changeTimesDisplay = trip.changeTimes.length > 0
              ? trip.changeTimes.join(' | ')
              : '-';

            const displayDuration = trip.duration && trip.duration !== '-' && !trip.duration.includes('NaN')
              ? trip.duration
              : formatDuration(calculateDuration(firstSeg['Departure Time'], lastSeg['Arrival Time']));

            return (
              <TableRow key={idx}>
                <TableCell>{firstSeg['Departure City']}</TableCell>
                <TableCell>{lastSeg['Arrival City']}</TableCell>
                <TableCell>{firstSeg['Departure Time']}</TableCell>
                <TableCell>{lastSeg['Arrival Time']}</TableCell>
                <TableCell>{displayDuration}</TableCell>
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