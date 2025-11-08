const express = require('express');
const cors = require('cors');
const connectionsRouter = require('./routes/connections');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/connections', connectionsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});