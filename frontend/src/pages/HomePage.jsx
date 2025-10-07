import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import SearchForm from '../components/SearchForm';
import ResultsTable from '../components/ResultsTable';
import { searchConnections, getAllConnections } from '../services/api';

export default function HomePage() {
  const [results, setResults] = useState([]);
  const [allConnections, setAllConnections] = useState([]);

  useEffect(() => {
    const loadConnections = async () => {
      const data = await getAllConnections();
      setAllConnections(data);
      setResults(data);
    };
    loadConnections();
  }, []);

  const handleSearch = async (query) => {
    const filteredResults = allConnections.filter(trip => {
    const firstSeg = trip.segments[0];
    const lastSeg = trip.segments[trip.segments.length - 1];
     
    const matchesDeparture = !query.departure || 
      firstSeg['Departure City'].toLowerCase().includes(query.departure);
      
    const matchesArrival = !query.arrival || 
      lastSeg['Arrival City'].toLowerCase().includes(query.arrival);
      
    const matchesDepartureTime = !query.departureTime || 
      firstSeg['Departure Time'].includes(query.departureTime);
      
    const matchesArrivalTime = !query.arrivalTime || 
      lastSeg['Arrival Time'].includes(query.arrivalTime);
      
    const matchesTrainType = !query.trainType || 
      trip.trainType.toLowerCase().includes(query.trainType);
      
    const matchesDaysOfOperation = !query.daysOfOperation || 
      trip.daysOfOperation.toLowerCase().includes(query.daysOfOperation);
      
    const matchesFirstClassPrice = !query.firstClassPrice || 
      parseFloat(trip.firstClassPrice) <= parseFloat(query.firstClassPrice);
      
    const matchesSecondClassPrice = !query.secondClassPrice || 
      parseFloat(trip.secondClassPrice) <= parseFloat(query.secondClassPrice);
      
    return matchesDeparture && matchesArrival && matchesDepartureTime && 
          matchesArrivalTime && matchesTrainType && matchesDaysOfOperation && 
          matchesFirstClassPrice && matchesSecondClassPrice;
    });
    
    setResults(filteredResults);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        Train Connection Search
      </Typography>
      <SearchForm onSearch={handleSearch} />
      <ResultsTable results={results} />
    </Container>
  );
}