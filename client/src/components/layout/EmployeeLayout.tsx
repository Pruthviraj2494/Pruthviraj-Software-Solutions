import React from 'react'
import BaseLayout from './BaseLayout'

const EMPLOYEE_NAV = [
  { to: '/employee', label: 'Dashboard' },
  { to: '/employee/projects', label: 'Projects' },
  { to: '/employee/messages', label: 'Messages' },
  { to: '/employee/profile', label: 'Profile' },
]

const EmployeeLayout: React.FC = () => (
  <BaseLayout title="Pruthviraj Software Solutions — Employee" navItems={EMPLOYEE_NAV} />
)

export default EmployeeLayout
