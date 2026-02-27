const auth = require('./middlewares/auth');
const authorize = require('./middlewares/authorize');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const userAdminsRoutes = require('./routes/users_admins');
const projectRoutes = require('./routes/projects');
const serviceRoutes = require('./routes/services');
const messageRoutes = require('./routes/messages');
const dashboardRoutes = require('./routes/dashboard');

function routes(app) {
    // Public routes - Auth (login/register)
    app.use('/api/v1/auth', authRoutes);

    // Protected routes - require authentication
    app.use('/api/v1/users', auth, userRoutes);
    app.use('/api/v1/users/admins', auth, userAdminsRoutes);
    app.use('/api/v1/projects', auth, projectRoutes);
    app.use('/api/v1/services', auth, serviceRoutes);
    app.use('/api/v1/messages', auth, messageRoutes);
    app.use('/api/v1/dashboard', auth, authorize('admin'), dashboardRoutes);
};

module.exports = routes