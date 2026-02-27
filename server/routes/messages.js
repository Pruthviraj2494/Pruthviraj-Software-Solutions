const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get messages between user and another user
router.get('/:otherId', messageController.getMessages);
// Mark message as read
router.put('/:messageId/read', messageController.markAsRead);

module.exports = router;
