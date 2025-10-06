import axios from 'axios';

const API_URL = 'http://localhost:5000/api/connections';

export const searchConnections = async (query) => {
  try {
    const response = await axios.get(API_URL, { params: query });
    return response.data;
  } catch (error) {
    console.error('API error', error);
    return [];
  }
};