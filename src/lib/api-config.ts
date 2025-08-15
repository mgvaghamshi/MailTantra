// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/v1/users/login',
  REGISTER: '/api/v1/users/register',
  LOGOUT: '/api/v1/users/logout',
  REFRESH: '/api/v1/users/refresh',
  
  // User Management
  PROFILE: '/api/v1/users/me',
  UPDATE_PROFILE: '/api/v1/users/me',
  CHANGE_PASSWORD: '/api/v1/users/change-password',
  RESET_PASSWORD: '/api/v1/users/request-password-reset',
  CONFIRM_RESET: '/api/v1/users/reset-password',
  VERIFY_EMAIL: '/api/v1/users/verify-email',
  SESSIONS: '/api/v1/users/sessions',
  
  // Admin
  ADMIN_USERS: '/api/v1/admin/users',
  ADMIN_ROLES: '/api/v1/admin/roles',
  ADMIN_STATS_USERS: '/api/v1/admin/stats/users',
  ADMIN_STATS_SECURITY: '/api/v1/admin/stats/security',
} as const

export default API_BASE_URL
