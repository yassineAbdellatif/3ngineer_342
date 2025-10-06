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
            <TableCell>1st Class (€)</TableCell>
            <TableCell>2nd Class (€)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((trip, idx) => (
            <TableRow key={idx}>
              <TableCell>{trip['Departure City']}</TableCell>
              <TableCell>{trip['Arrival City']}</TableCell>
              <TableCell>{trip['Departure Time']}</TableCell>
              <TableCell>{trip['Arrival Time']}</TableCell>
              <TableCell>{trip.duration}</TableCell>
              <TableCell>{trip['Train Type']}</TableCell>
              <TableCell>{trip['First Class ticket rate']}</TableCell>
              <TableCell>{trip['Second Class ticket rate']}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}