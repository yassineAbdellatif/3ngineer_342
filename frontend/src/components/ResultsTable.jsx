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

  const sortedResults = [...results].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (orderBy === 'duration') {
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