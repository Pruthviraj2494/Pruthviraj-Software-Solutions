const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const projectController = require('../controllers/projectController');

// Admin: create project
router.post('/', authorize('admin'), projectController.createProject);
// Admin: update project
router.put('/:id', authorize('admin'), projectController.updateProject);
// Admin: assign employee
router.post('/:id/assign', authorize('admin'), projectController.assignEmployee);
// Admin: unassign employee
router.post('/:id/unassign', authorize('admin'), projectController.unassignEmployee);
// Employee: update project status
router.post('/:id/status', authorize('employee'), projectController.updateStatus);
// Get projects (role-based)
router.get('/', projectController.getProjects);

module.exports = router;
