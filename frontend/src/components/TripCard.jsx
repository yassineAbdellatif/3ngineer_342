import { Card, CardContent, Typography } from '@mui/material';

export default function TripCard({ trip }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{trip['Departure City']} → {trip['Arrival City']}</Typography>
        <Typography>Departure: {trip['Departure Time']}</Typography>
        <Typography>Arrival: {trip['Arrival Time']}</Typography>
        <Typography>Duration: {trip.duration}</Typography>
        <Typography>Train Type: {trip['Train Type']}</Typography>
        <Typography>1st Class: €{trip['First Class ticket rate']}</Typography>
        <Typography>2nd Class: €{trip['Second Class ticket rate']}</Typography>
      </CardContent>
    </Card>
  );
}