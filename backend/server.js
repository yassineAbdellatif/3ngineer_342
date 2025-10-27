const express = require('express');
const cors = require('cors');
const connectionsRoutes = require('./routes/connections');
const tripRoutes = require('./routes/tripRoutes');
const app = express();

app.use(cors()); // allow requests from any origin
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/connections', connectionsRoutes);
app.use('/api/trips', tripRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});