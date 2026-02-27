const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { handleAPIResponse } = require('../utils/utils');

// List admin users (basic info) for all authenticated roles
router.get('/', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('_id name email role profile');
        handleAPIResponse.success(res, admins);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
});

module.exports = router;

