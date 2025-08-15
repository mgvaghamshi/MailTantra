import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { API_BASE_URL, API_ENDPOINTS } from './api-config'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ConfirmResetRequest,
  UpdateProfileRequest,
  UserSession,
  UserListResponse,
  Role,
  UserStats,
  SecurityStats,
  ApiError
} from '@/types/auth'

// JWT Token interface
interface JWTPayload {
  sub: string // user ID
  session_id: string
  jti: string
  type: 'access' | 'refresh'
  exp: number
  iat: number
}

class ApiClient {
  private client: AxiosInstance
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private emailTrackerApiKey: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Initialize tokens from localStorage
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token')
      this.refreshToken = localStorage.getItem('refresh_token')
      this.emailTrackerApiKey = localStorage.getItem('emailtracker_api_key')
    }

    // Request interceptor to add auth header
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.accessToken && this.refreshToken) {
          try {
            await this.refreshAccessToken()
            // Retry the original request
            const config = error.config
            config.headers.Authorization = `Bearer ${this.accessToken}`
            return this.client.request(config)
          } catch (refreshError) {
            this.clearTokens()
            // Redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login'
            }
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Token management
  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    }
  }

  private setEmailTrackerApiKey(apiKey: string) {
    this.emailTrackerApiKey = apiKey
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailtracker_api_key', apiKey)
    }
  }

  getEmailTrackerApiKey(): string | null {
    return this.emailTrackerApiKey
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  private clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    this.emailTrackerApiKey = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('emailtracker_api_key')
      localStorage.removeItem('user')
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.refreshToken}`,
        },
      }
    )

    const { access_token, refresh_token } = response.data
    this.setTokens(access_token, refresh_token)
  }

  // Token validation
  isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp > currentTime
    } catch {
      return false
    }
  }

  isAuthenticated(): boolean {
    return !!(this.accessToken && this.isTokenValid(this.accessToken))
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  private saveUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.client.post(
        API_ENDPOINTS.LOGIN,
        credentials
      )
      
      const { access_token, refresh_token, user, api_key } = response.data
      this.setTokens(access_token, refresh_token)
      
      // Store EmailTracker API key if provided
      if (api_key) {
        this.setEmailTrackerApiKey(api_key)
      }
      
      this.saveUser(user)
      
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response: AxiosResponse<RegisterResponse> = await this.client.post(
        API_ENDPOINTS.REGISTER,
        userData
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        await this.client.post(API_ENDPOINTS.LOGOUT)
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      this.clearTokens()
    }
  }

  async refreshTokens(): Promise<void> {
    await this.refreshAccessToken()
  }

  // User profile methods
  async getProfile(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.client.get(API_ENDPOINTS.PROFILE)
      this.saveUser(response.data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.client.put(
        API_ENDPOINTS.UPDATE_PROFILE,
        data
      )
      this.saveUser(response.data)
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.CHANGE_PASSWORD, data)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async requestPasswordReset(data: ResetPasswordRequest): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.RESET_PASSWORD, data)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async confirmPasswordReset(data: ConfirmResetRequest): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.CONFIRM_RESET, data)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.VERIFY_EMAIL, { token })
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async getSessions(): Promise<UserSession[]> {
    try {
      const response: AxiosResponse<UserSession[]> = await this.client.get(
        API_ENDPOINTS.SESSIONS
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      await this.client.delete(`${API_ENDPOINTS.SESSIONS}/${sessionId}`)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  // Admin methods
  async getUsers(page = 1, size = 20): Promise<UserListResponse> {
    try {
      const response: AxiosResponse<UserListResponse> = await this.client.get(
        `${API_ENDPOINTS.ADMIN_USERS}?page=${page}&size=${size}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.client.get(
        `${API_ENDPOINTS.ADMIN_USERS}/${userId}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response: AxiosResponse<Role[]> = await this.client.get(
        API_ENDPOINTS.ADMIN_ROLES
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    try {
      await this.client.post(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/roles/${roleId}`)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    try {
      await this.client.delete(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/roles/${roleId}`)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response: AxiosResponse<UserStats> = await this.client.get(
        API_ENDPOINTS.ADMIN_STATS_USERS
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async getSecurityStats(): Promise<SecurityStats> {
    try {
      const response: AxiosResponse<SecurityStats> = await this.client.get(
        API_ENDPOINTS.ADMIN_STATS_SECURITY
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  // Error handling
  private handleError(error: any): Error {
    if (error.response?.data) {
      const apiError = error.response.data as ApiError
      if (apiError.error) {
        return new Error(apiError.error.message)
      }
      
      // Handle validation errors
      if (Array.isArray(error.response.data.detail)) {
        const validationErrors = error.response.data.detail
        const messages = validationErrors.map((err: any) => err.msg).join(', ')
        return new Error(messages)
      }
    }
    
    return new Error(error.message || 'An unexpected error occurred')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
