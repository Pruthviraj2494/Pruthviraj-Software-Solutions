// Role-based authorization middleware
// Usage: authorize('admin'), authorize('employee', 'client'), etc.

const { handleAPIResponse } = require('../utils/utils');

module.exports = function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return handleAPIResponse.forbidden(res, 'Insufficient permissions');
        }
        next();
    };
};
