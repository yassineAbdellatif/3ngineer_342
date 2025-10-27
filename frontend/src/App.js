import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import HomePage from "./pages/HomePage";
import TripBookingPage from "./pages/TripBookingPage";
import ViewTripsPage from "./pages/ViewTripsPage";
import { useState } from "react";

export default function App() {
  const [selectedConnection, setSelectedConnection] = useState(null);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/book">Book Trip</Button>
          <Button color="inherit" component={Link} to="/view">View Trips</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route
            path="/"
            element={<HomePage onSelectConnection={setSelectedConnection} />}
          />
          <Route
            path="/book"
            element={
              selectedConnection ? (
                <TripBookingPage selectedConnection={selectedConnection} />
              ) : (
                <p>Please search and select a connection first.</p>
              )
            }
          />
          <Route path="/view" element={<ViewTripsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}