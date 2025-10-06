import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import SearchForm from '../components/SearchForm';
import ResultsTable from '../components/ResultsTable';
import { searchConnections } from '../services/api';

export default function HomePage() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    const data = await searchConnections(query);
    setResults(data);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        Automatic Zoom
      </Typography>
      <SearchForm onSearch={handleSearch} />
      <ResultsTable results={results} />
    </Container>
  );
}