import React, { useState } from "react";
import { viewTrips } from "../services/api";
import TripCard from "../components/TripCard";

export default function ViewTripsPage() {
  const [lastName, setLastName] = useState("");
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await viewTrips(lastName, id);
      setData(res);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="view-trips">
      <h2>View My Trips</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Traveller ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div>
          <h3>Current Trips</h3>
          {data.currentTrips.length > 0 ? (
            data.currentTrips.map((t) => (
              <TripCard key={t.tripId} trip={t} />
            ))
          ) : (
            <p>No current trips found.</p>
          )}

          <h3>Past Trips</h3>
          {data.historyTrips.length > 0 ? (
            data.historyTrips.map((t) => (
              <TripCard key={t.tripId} trip={t} />
            ))
          ) : (
            <p>No past trips found.</p>
          )}
        </div>
      )}
    </div>
  );
}