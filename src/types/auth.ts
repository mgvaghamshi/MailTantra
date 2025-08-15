// Authentication and User Types
export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  avatar_url: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login_at: string | null
  timezone: string
  locale: string
  roles?: Role[]
  permissions?: string[]
}

export interface Role {
  id: string
  name: string
  display_name: string
  description: string | null
  permissions: string[]
  is_system: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  device_info: string | null
  ip_address: string | null
  user_agent: string | null
  location: string | null
  is_active: boolean
  created_at: string
  last_activity: string
  expires_at: string
}

// Authentication Request/Response Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
  api_key?: string // Optional API key for EmailTracker API
}

export interface RegisterRequest {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
}

export interface RegisterResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  new_password_confirm: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ConfirmResetRequest {
  token: string
  new_password: string
  new_password_confirm: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  timezone?: string
  locale?: string
}

// API Error Response
export interface ApiError {
  error: {
    code: number
    message: string
    type: string
    timestamp: number
    path: string
  }
}

// Admin Types
export interface UserListResponse {
  users: User[]
  total: number
  page: number
  size: number
  pages: number
}

export interface UserStats {
  total_users: number
  active_users: number
  verified_users: number
  new_users_30d: number
  active_users_30d: number
  failed_logins_24h: number
  active_sessions: number
  verification_rate: number
  activity_rate: number
}

export interface SecurityStats {
  locked_accounts: number
  login_attempts_24h: number
  successful_logins_24h: number
  failed_logins_24h: number
  suspicious_ips_24h: number
  success_rate: number
}

// Form Validation Types
export interface ValidationError {
  type: string
  loc: string[]
  msg: string
  input: any
  ctx?: any
  url?: string
}

export interface ValidationErrorResponse {
  detail: ValidationError[]
}
