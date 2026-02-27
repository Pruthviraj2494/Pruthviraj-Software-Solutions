const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const userController = require('../controllers/userController');

// Admin: list users
router.get('/', authorize('admin'), userController.listUsers);
// Admin: create user (employee/client)
router.post('/', authorize('admin'), userController.createUser);
// Admin: delete user
router.delete('/:id', authorize('admin'), userController.deleteUser);
// User: get own profile
router.get('/me', userController.getProfile);
// User: update own profile
router.put('/me', userController.updateProfile);

module.exports = router;
