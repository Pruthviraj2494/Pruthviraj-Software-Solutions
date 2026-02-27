const Project = require('../models/Project');
const { handleAPIResponse } = require('../utils/utils');

// Admin: create a new project
exports.createProject = async (req, res) => {
    try {
        const { name, description, client, assignedEmployees } = req.body;
        if (!name || !client) {
            return handleAPIResponse.error(res, 'Name and client required', 400);
        }
        const projectData = { name, description, client, assignedEmployees: assignedEmployees || [], status: 'pending' };
        const project = await Project.create(projectData);
        handleAPIResponse.success(res, project, 201, 'Project created');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Admin: update project (name, description, status)
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const project = await Project.findByIdAndUpdate(id, updates, { new: true });
        if (!project) {
            return handleAPIResponse.notFound(res, 'Project not found');
        }
        handleAPIResponse.success(res, project);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Admin: assign employees to project
exports.assignEmployee = async (req, res) => {
    try {
        const { id } = req.params; // project id
        const { employeeId } = req.body;
        const project = await Project.findById(id);
        if (!project) {
            return handleAPIResponse.notFound(res, 'Project not found');
        }
        if (!project.assignedEmployees.includes(employeeId)) {
            project.assignedEmployees.push(employeeId);
            await project.save();
        }
        handleAPIResponse.success(res, project, 200, 'Employee assigned');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};// Admin: unassign employee from project
exports.unassignEmployee = async (req, res) => {
    try {
        const { id } = req.params; // project id
        const { employeeId } = req.body;
        const project = await Project.findById(id);
        if (!project) return handleAPIResponse.notFound(res, 'Project not found');
        project.assignedEmployees = project.assignedEmployees.filter(eid => eid.toString() !== employeeId);
        await project.save();
        handleAPIResponse.success(res, project, 200, 'Employee unassigned');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Employee: update project status (only if assigned)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params; // project id
        const { status } = req.body;
        const project = await Project.findById(id);
        if (!project) {
            return handleAPIResponse.notFound(res, 'Project not found');
        }
        if (!project.assignedEmployees.map(e => e.toString()).includes(req.user._id.toString())) {
            return handleAPIResponse.forbidden(res, 'Not assigned to this project');
        }
        project.status = status;
        await project.save();
        handleAPIResponse.success(res, project, 200, 'Project status updated');
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};

// Get projects (admin: all, employee: assigned, client: own)
exports.getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'admin') {
            projects = await Project.find().populate('client assignedEmployees');
        } else if (req.user.role === 'employee') {
            projects = await Project.find({ assignedEmployees: req.user._id }).populate('client assignedEmployees');
        } else if (req.user.role === 'client') {
            projects = await Project.find({ client: req.user._id }).populate('client assignedEmployees');
        }
        handleAPIResponse.success(res, projects);
    } catch (err) {
        handleAPIResponse.error(res, err.message, 500);
    }
};
