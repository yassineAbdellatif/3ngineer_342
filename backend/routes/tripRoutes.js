const express = require('express');
const router = express.Router();
const { bookTrip, viewTrips } = require('../controllers/tripController');

router.post('/book', bookTrip);
router.get('/view', viewTrips);

module.exports = router;