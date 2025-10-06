const express = require('express');
const router = express.Router();
const { searchConnections } = require('../controllers/connectionsController');

router.get('/', searchConnections);

module.exports = router;