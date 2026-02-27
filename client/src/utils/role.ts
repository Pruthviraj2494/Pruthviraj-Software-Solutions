import type { UserRole } from '../types'

export const ROLE_HOME: Record<UserRole, string> = {
  admin: '/admin',
  employee: '/employee',
  client: '/client',
}

export function getRoleHome(role: UserRole): string {
  return ROLE_HOME[role] ?? '/login'
}
