import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function SearchForm({ onSearch }) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ departure, arrival });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 4 }}>
      <TextField
        label="Departure City"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
      />
      <TextField
        label="Arrival City"
        value={arrival}
        onChange={(e) => setArrival(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Search
      </Button>
    </Box>
  );
}