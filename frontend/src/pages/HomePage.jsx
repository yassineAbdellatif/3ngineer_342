import { useState } from "react";
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import ResultsTable from "../components/ResultsTable";
import { searchConnections } from "../services/api";

export default function HomePage({ onSelectConnection }) {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    const data = await searchConnections(query);
    setResults(data);
  };

  const handleSelect = (trip) => {
    setSelected(trip);
    onSelectConnection(trip);
    setOpenDialog(true); // Open the dialog when a trip is selected
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBookTrip = () => {
    setOpenDialog(false);
    navigate("/book");
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        Train Connection Search
      </Typography>

      <SearchForm onSearch={handleSearch} />

      <ResultsTable results={results} onSelect={handleSelect} />

      {/* Booking Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Trip Selection</DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Typography variant="h6" gutterBottom>
                {selected.departure} → {selected.arrival}
              </Typography>
              <Typography variant="body1">
                <strong>Train Type:</strong> {selected.trainType}
              </Typography>
              <Typography variant="body1">
                <strong>Duration:</strong> {selected.duration}
              </Typography>
              <Typography variant="body1">
                <strong>Days of Operation:</strong> {selected.daysOfOperation}
              </Typography>
              <Typography variant="body1">
                <strong>First Class Price:</strong> €{selected.firstClassPrice}
              </Typography>
              <Typography variant="body1">
                <strong>Second Class Price:</strong> €{selected.secondClassPrice}
              </Typography>
              <Typography variant="body1">
                <strong>Stops:</strong> {selected.segments.length - 1}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBookTrip} variant="contained" color="primary">
            Book This Trip
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}