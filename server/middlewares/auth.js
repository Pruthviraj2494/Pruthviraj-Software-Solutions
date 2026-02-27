const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { handleAPIResponse } = require('../utils/utils');

module.exports = async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return handleAPIResponse.unauthorized(res, 'No token provided')
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return handleAPIResponse.unauthorized(res, 'User not found');
        }
        next();
    } catch (err) {
        handleAPIResponse.unauthorized(res, 'Invalid token');
    }
};
