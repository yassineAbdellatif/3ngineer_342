import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

export default function TripCard({ trip }) {
  const conn = trip.connection;
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {conn.departure} → {conn.arrival}
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Trip ID:</strong> {trip.tripId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Booked:</strong> {new Date(trip.bookedAt).toLocaleString()}
          </Typography>
        </Box>

        <Typography variant="body1">
          <strong>Train Type:</strong> {conn.trainType}
        </Typography>
        <Typography variant="body1">
          <strong>Duration:</strong> {conn.duration}
        </Typography>
        <Typography variant="body1">
          <strong>Days of Operation:</strong> {conn.daysOfOperation}
        </Typography>
        <Typography variant="body1">
          <strong>Stops:</strong> {conn.segments.length - 1}
        </Typography>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1">
            <strong>1st Class:</strong> €{conn.firstClassPrice} | <strong>2nd Class:</strong> €{conn.secondClassPrice}
          </Typography>
        </Box>

        {conn.arrivalTimeWithDays && (
          <Typography variant="body2" color="text.secondary">
            <strong>Arrival:</strong> {conn.arrivalTimeWithDays}
          </Typography>
        )}

        {/* Show travellers on this trip */}
        {trip.reservations && trip.reservations.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Travellers:
            </Typography>
            {trip.reservations.map((res) => (
              <Chip 
                key={res.ticketId}
                label={`${res.traveller.name} (Ticket: ${res.ticketId})`}
                size="small"
                sx={{ mr: 1, mt: 0.5 }}
              />
            ))}
          </Box>
        )}

        {/* Show route segments */}
        {conn.segments && conn.segments.length > 0 && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Route Details:
            </Typography>
            {conn.segments.map((seg, idx) => (
              <Typography key={idx} variant="body2" sx={{ ml: 1 }}>
                {idx + 1}. {seg["Departure City"]} ({seg["Departure Time"]}) → {seg["Arrival City"]} ({seg["Arrival Time"]})
                {conn.changeTimes && conn.changeTimes[idx] && (
                  <span style={{ color: '#666', fontSize: '0.85em' }}>
                    {' '}(Wait: {conn.changeTimes[idx]})
                  </span>
                )}
              </Typography>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}