const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const { handleAPIResponse } = require('../utils/utils');

exports.getStats = async (req, res) => {
    try {
        const [userCount, employeeCount, clientCount, projectCount, serviceCount, pendingRequests] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'employee' }),
            User.countDocuments({ role: 'client' }),
            Project.countDocuments(),
            Service.countDocuments(),
            ServiceRequest.countDocuments({ status: 'pending' })
        ]);
        const stats = {
            users: userCount,
            employees: employeeCount,
            clients: clientCount,
            projects: projectCount,
            services: serviceCount,
            pendingServiceRequests: pendingRequests
        };
        handleAPIResponse.success(res, stats, 200, 'Dashboard stats');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};
