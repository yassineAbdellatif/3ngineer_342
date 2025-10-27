import React, { useState } from "react";
import { bookTrip } from "../services/api";

export default function TripBookingPage({ selectedConnection }) {
  const [travellers, setTravellers] = useState([{ name: "", age: "", id: "" }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTravellerChange = (index, field, value) => {
    const updated = [...travellers];
    updated[index][field] = value;
    setTravellers(updated);
  };

  const addTraveller = () => setTravellers([...travellers, { name: "", age: "", id: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await bookTrip(travellers, selectedConnection);
      setMessage(`Trip booked successfully! Trip ID: ${res.trip.tripId}`);
    } catch (err) {
      setMessage(`${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="trip-booking">
      <h2>Book Trip</h2>
      <form onSubmit={handleSubmit}>
        {travellers.map((t, i) => (
          <div key={i} className="traveller">
            <input
              type="text"
              placeholder="Full Name"
              value={t.name}
              onChange={(e) => handleTravellerChange(i, "name", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={t.age}
              onChange={(e) => handleTravellerChange(i, "age", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="ID"
              value={t.id}
              onChange={(e) => handleTravellerChange(i, "id", e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addTraveller}>➕ Add Traveller</button>
        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Trip"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}