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
  const [orderBy, setOrderBy] = useState('duration'); // default sort field
  const [order, setOrder] = useState('asc'); // asc or desc

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const sortedResults = [...results].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    // For duration, convert "Xh Ym" to minutes
    if (orderBy === 'duration') {
      const parseDuration = (str) => {
        if (!str) return 0;
        const match = str.match(/(\d+)h (\d+)m/);
        return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
      };
      valA = parseDuration(valA);
      valB = parseDuration(valB);
    }

    return order === 'asc' ? valA - valB : valB - valA;
  });

  if (!results || results.length === 0) return <p>No trips found</p>;

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
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((trip, idx) => (
            <TableRow key={idx}>
              <TableCell>{trip.departure}</TableCell>
              <TableCell>{trip.arrival}</TableCell>
              <TableCell>{trip.departureTime}</TableCell>
              <TableCell>{trip.arrivalTime}</TableCell>
              <TableCell>{trip.duration}</TableCell>
              <TableCell>{trip.trainType}</TableCell>
              <TableCell>{trip.daysOfOperation}</TableCell>
              <TableCell>{trip.firstClassPrice}</TableCell>
              <TableCell>{trip.secondClassPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}