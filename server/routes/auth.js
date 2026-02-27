const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { handleAPIResponse } = require('../utils/utils');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, profile } = req.body;
        if (!name || !email || !password || !role) {
            return handleAPIResponse.error(res, 'Missing required fields', 400);
        }
        const exists = await User.findOne({ email });
        if (exists) {
            return handleAPIResponse.conflict(res, 'Email already exists');
        }
        const hashed = await hashPassword(password);
        const user = await User.create({ name, email, password: hashed, role, profile });
        handleAPIResponse.success(res, { id: user._id, name, email, role }, 201, 'User registered');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return handleAPIResponse.error(res, 'Email and password required', 400);
        }
        const user = await User.findOne({ email });
        if (!user) {
            return handleAPIResponse.unauthorized(res, 'Invalid credentials');
        }
        const valid = await comparePassword(password, user.password);
        if (!valid) {
            return handleAPIResponse.unauthorized(res, 'Invalid credentials');
        }
        const tokenData = generateToken({ id: user._id });
        const loginResponse = {
            accessToken: tokenData.accessToken,
            accessTokenExpiry: tokenData.accessTokenExpiry,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        };

        handleAPIResponse.success(res, loginResponse, 200, 'Login successful');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
});

module.exports = router;
