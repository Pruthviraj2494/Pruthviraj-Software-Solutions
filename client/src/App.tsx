import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import RoleRoute from './components/RoleRoute'
import HomeRedirect from './components/HomeRedirect'
import AdminLayout from './components/layout/AdminLayout'
import EmployeeLayout from './components/layout/EmployeeLayout'
import ClientLayout from './components/layout/ClientLayout'
import MessagesPage from './pages/Messages'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminProjects from './pages/admin/Projects'
import AdminServices from './pages/admin/Services'
import AdminRequests from './pages/admin/Requests'
import AdminProfile from './pages/admin/Profile'
import EmployeeDashboard from './pages/employee/Dashboard'
import EmployeeProjects from './pages/employee/Projects'
import EmployeeProfile from './pages/employee/Profile'
import ClientDashboard from './pages/client/Dashboard'
import ClientProjects from './pages/client/Projects'
import ClientRequestService from './pages/client/RequestService'
import ClientProfile from './pages/client/Profile'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route
        path="/employee"
        element={
          <RoleRoute allowedRoles={['employee']}>
            <EmployeeLayout />
          </RoleRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="projects" element={<EmployeeProjects />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>

      <Route
        path="/client"
        element={
          <RoleRoute allowedRoles={['client']}>
            <ClientLayout />
          </RoleRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="projects" element={<ClientProjects />} />
        <Route path="request-service" element={<ClientRequestService />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ClientProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
