import React from 'react'
import BaseLayout from './BaseLayout'

const CLIENT_NAV = [
  { to: '/client', label: 'Dashboard' },
  { to: '/client/projects', label: 'Projects' },
  { to: '/client/request-service', label: 'Request service' },
  { to: '/client/messages', label: 'Messages' },
  { to: '/client/profile', label: 'Profile' },
]

const ClientLayout: React.FC = () => (
  <BaseLayout title="Pruthviraj Software Solutions — Client" navItems={CLIENT_NAV} />
)

export default ClientLayout
