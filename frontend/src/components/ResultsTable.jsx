import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export default function ResultsTable({ results }) {
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
            <TableCell>Duration</TableCell>
            <TableCell>Train Type</TableCell>
            <TableCell>Days of Operation</TableCell>
            <TableCell>1st Class (€)</TableCell>
            <TableCell>2nd Class (€)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((trip, idx) => (
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