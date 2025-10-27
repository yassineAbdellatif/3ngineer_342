import { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import ResultsTable from "../components/ResultsTable";
import { searchConnections } from "../services/api";

export default function HomePage({ onSelectConnection }) {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    const data = await searchConnections(query);
    setResults(data);
  };

  const handleSelect = (trip) => {
    setSelected(trip);
    onSelectConnection(trip);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        Train Connection Search
      </Typography>

      <SearchForm onSearch={handleSearch} />

      <ResultsTable results={results} onSelect={handleSelect} />

      {selected && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6">
            Selected Trip: {selected.departure} → {selected.arrival}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/book")}
          >
            Book This Trip
          </Button>
        </div>
      )}
    </Container>
  );
}