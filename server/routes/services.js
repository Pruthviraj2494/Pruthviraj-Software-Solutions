const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const serviceController = require('../controllers/serviceController');

// Admin: create service
router.post('/', authorize('admin'), serviceController.createService);
// Get all services
router.get('/', serviceController.getServices);
// Admin: list pending service requests
router.get('/requests', authorize('admin'), serviceController.listPendingRequests);
// Client: list own service requests
router.get('/my-requests', authorize('client'), serviceController.listMyRequests);
// Client: request a service
router.post('/request', authorize('client'), serviceController.requestService);
// Admin: approve a service request
router.post('/approve', authorize('admin'), serviceController.approveService);

module.exports = router;
