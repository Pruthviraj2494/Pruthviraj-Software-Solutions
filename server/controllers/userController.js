const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { handleAPIResponse } = require('../utils/utils');

exports.createUser = async (req, res) => {
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
        const userData = { id: user._id, name, email, role };
        handleAPIResponse.success(res, userData, 201, 'User created');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return handleAPIResponse.notFound(res, 'User not found');
        }
        handleAPIResponse.success(res, null, 200, 'User deleted');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        handleAPIResponse.success(res, user);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        handleAPIResponse.success(res, user);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Admin: list users, optionally filtered by role
exports.listUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const query = role ? { role } : {};
        const users = await User.find(query).select('-password');
        handleAPIResponse.success(res, users);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};
