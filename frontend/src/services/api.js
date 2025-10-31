import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// --- Existing search function ---
export const searchConnections = async (query) => {
  try {
    const response = await axios.get(`${API_BASE}/connections`, { params: query });
    return response.data;
  } catch (error) {
    console.error("API error", error);
    return [];
  }
};

// --- Book a trip ---
export const bookTrip = async (travellers, connection) => {
  try {
    const response = await axios.post(`${API_BASE}/trips/book`, {
      travellers,
      connection,
    });
    return response.data;
  } catch (error) {
    console.error("Booking error", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Booking failed");
  }
};

// --- View trips ---
export const viewTrips = async (lastName, id) => {
  try {
    const response = await axios.get(`${API_BASE}/trips/view`, {
      params: { lastName, id },
    });
    return response.data;
  } catch (error) {
    console.error("View trips error", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to load trips");
  }
};