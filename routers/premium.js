const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium');

router.use('/leaderboard', premiumController.getAllExpenses)

module.exports = router;