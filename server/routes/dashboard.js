const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const dashboardController = require('../controllers/dashboardController');

// Admin: get dashboard stats
router.get('/stats', authorize('admin'), dashboardController.getStats);

module.exports = router;
