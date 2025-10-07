import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function SearchForm({ onSearch }) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [trainType, setTrainType] = useState('');
  const [daysOfOperation, setDaysOfOperation] = useState('');
  const [firstClassPrice, setFirstClassPrice] = useState('');
  const [secondClassPrice, setSecondClassPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      departure: departure.toLowerCase().trim(),
      arrival : arrival.toLowerCase().trim(),
      departureTime,
      arrivalTime,
      trainType : trainType.toLowerCase().trim(),
      daysOfOperation : daysOfOperation.toLowerCase().trim(),
      firstClassPrice,
      secondClassPrice,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}
    >
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
      <TextField
        label="Departure Time"
        value={departureTime}
        onChange={(e) => setDepartureTime(e.target.value)}
        placeholder="HH:MM"
      />
      <TextField
        label="Arrival Time"
        value={arrivalTime}
        onChange={(e) => setArrivalTime(e.target.value)}
        placeholder="HH:MM"
      />
      <TextField
        label="Train Type"
        value={trainType}
        onChange={(e) => setTrainType(e.target.value)}
      />
      <TextField
        label="Days of Operation"
        value={daysOfOperation}
        onChange={(e) => setDaysOfOperation(e.target.value)}
        placeholder="Mon-Fri, Sat, Sun"
      />
      <TextField
        label="1st Class Price (€)"
        type="number"
        value={firstClassPrice}
        onChange={(e) => setFirstClassPrice(e.target.value)}
      />
      <TextField
        label="2nd Class Price (€)"
        type="number"
        value={secondClassPrice}
        onChange={(e) => setSecondClassPrice(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Search
      </Button>
    </Box>
  );
}