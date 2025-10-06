const express = require('express');
const cors = require('cors');
const connectionsRoutes = require('./routes/connections');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/connections', connectionsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});