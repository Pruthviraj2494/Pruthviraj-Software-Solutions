/** User role in the portal */
export type UserRole = 'admin' | 'employee' | 'client'

/** User profile (optional fields from API) */
export interface UserProfile {
  phone?: string
  company?: string
  position?: string
  avatar?: string
}

/** User entity (login response and profile) */
export interface User {
  id: string
  _id?: string // server may return _id
  name: string
  email: string
  role: UserRole
  profile?: UserProfile
  createdAt?: string
  updatedAt?: string
}

/** Project status */
export type ProjectStatus = 'pending' | 'active' | 'completed'

/** Project entity (populated client and assignedEmployees from API) */
export interface Project {
  _id: string
  name: string
  description?: string
  client: User | string
  assignedEmployees: (User | string)[]
  status: ProjectStatus
  createdAt: string
}

/** Service entity */
export interface Service {
  _id: string
  name: string
  description?: string
  createdAt?: string
}

/** Service request status */
export type ServiceRequestStatus = 'pending' | 'approved' | 'rejected'

/** Service request (client requests a service; admin approves) */
export interface ServiceRequest {
  _id: string
  client: User | string
  service: Service | string
  status: ServiceRequestStatus
  details?: string
  createdAt: string
  approvedAt?: string
}

/** Message entity (chat) */
export interface Message {
  _id: string
  sender: string | User
  receiver: string | User
  content: string
  delivered?: boolean
  read: boolean
  timestamp: string
}

/** Dashboard stats (admin only) */
export interface DashboardStats {
  users: number
  employees: number
  clients: number
  projects: number
  services: number
  pendingServiceRequests: number
}

/** API response wrapper from server */
export interface ApiResponse<T = unknown> {
  status: { code: number; message: string }
  data: T
}
