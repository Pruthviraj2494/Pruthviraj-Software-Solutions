const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const Project = require('../models/Project');
const { handleAPIResponse } = require('../utils/utils');

// Admin: create a new service
exports.createService = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return handleAPIResponse.error(res, 'Name required', 400);
        }
        const service = await Service.create({ name, description });
        handleAPIResponse.success(res, service, 201, 'Service created');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Get all services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        handleAPIResponse.success(res, services);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Admin: list pending service requests (with populated client & service)
exports.listPendingRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ status: 'pending' })
            .populate('client')
            .populate('service');
        handleAPIResponse.success(res, requests);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Client: request a service
exports.requestService = async (req, res) => {
    try {
        const { serviceId, details } = req.body;
        if (!serviceId) {
            return handleAPIResponse.error(res, 'Service required', 400);
        }
        const request = await ServiceRequest.create({ client: req.user._id, service: serviceId, details });
        handleAPIResponse.success(res, request, 201, 'Service requested');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Client: list own service requests (all statuses)
exports.listMyRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ client: req.user._id })
            .populate('service')
            .sort({ createdAt: -1 });
        handleAPIResponse.success(res, requests);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Admin: approve a service request and create a project
exports.approveService = async (req, res) => {
    try {
        const { requestId, projectName, projectDescription } = req.body;
        const request = await ServiceRequest.findById(requestId).populate('client service');
        if (!request) {
            return handleAPIResponse.notFound(res, 'Request not found');
        }
        if (request.status !== 'pending') {
            return handleAPIResponse.error(res, 'Already processed', 400);
        }
        request.status = 'approved';
        request.approvedAt = new Date();
        await request.save();
        const projectData = {
            name: projectName || request.service.name,
            description: projectDescription || request.details,
            client: request.client._id,
            assignedEmployees: [],
            status: 'pending'
        };
        const project = await Project.create(projectData);
        const responseData = { request, project };
        handleAPIResponse.success(res, responseData, 200, 'Service approved, project created');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};
