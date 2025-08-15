'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types/auth'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
  }) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user && apiClient.isAuthenticated()

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  // Check if user has specific role
  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles) return false
    return user.roles.some(role => role.name === roleName)
  }

  // Check if user is admin
  const isAdmin = user ? hasRole('admin') : false

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          // Try to refresh user profile
          const userProfile = await apiClient.getProfile()
          setUser(userProfile)
        } else {
          // Clear any stale user data
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      const response = await apiClient.login({ email, password })
      setUser(response.user)
      toast.success('Welcome back!', {
        description: `Logged in as ${response.user.email}`,
      })
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
  }): Promise<void> => {
    try {
      setLoading(true)
      await apiClient.register(userData)
      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account.',
      })
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      await apiClient.logout()
      setUser(null)
      toast.success('Logged out successfully')
    } catch (error: any) {
      console.error('Logout error:', error)
      // Still clear local state even if API call fails
      setUser(null)
      toast.success('Logged out successfully')
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async (): Promise<void> => {
    try {
      if (apiClient.isAuthenticated()) {
        const userProfile = await apiClient.getProfile()
        setUser(userProfile)
      }
    } catch (error: any) {
      console.error('Failed to refresh profile:', error)
      toast.error('Failed to refresh profile', {
        description: error.message,
      })
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    isAuthenticated,
    hasPermission,
    hasRole,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
