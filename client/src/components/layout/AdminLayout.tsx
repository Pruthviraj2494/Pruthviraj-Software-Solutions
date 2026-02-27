import React from 'react'
import BaseLayout from './BaseLayout'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/requests', label: 'Service requests' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/profile', label: 'Profile' },
]

const AdminLayout: React.FC = () => (
  <BaseLayout title="Pruthviraj Software Solutions — Admin" navItems={ADMIN_NAV} />
)

export default AdminLayout
