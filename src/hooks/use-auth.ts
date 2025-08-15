'use client'

import { useAuth } from '@/contexts/auth-context'
import { User } from '@/types/auth'
import { apiClient } from '@/lib/api-client'
import { useState } from 'react'
import { toast } from 'sonner'

// Custom hook for user profile management
export function useProfile() {
  const { user, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)

  const updateProfile = async (data: {
    first_name?: string
    last_name?: string
    timezone?: string
    locale?: string
  }): Promise<User> => {
    try {
      setLoading(true)
      const updatedUser = await apiClient.updateProfile(data)
      await refreshProfile()
      toast.success('Profile updated successfully')
      return updatedUser
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (data: {
    current_password: string
    new_password: string
    new_password_confirm: string
  }): Promise<void> => {
    try {
      setLoading(true)
      await apiClient.changePassword(data)
      toast.success('Password changed successfully')
    } catch (error: any) {
      toast.error('Failed to change password', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    updateProfile,
    changePassword,
    refreshProfile,
  }
}

// Custom hook for password reset
export function usePasswordReset() {
  const [loading, setLoading] = useState(false)

  const requestReset = async (email: string): Promise<void> => {
    try {
      setLoading(true)
      await apiClient.requestPasswordReset({ email })
      toast.success('Password reset email sent', {
        description: 'Please check your email for reset instructions.',
      })
    } catch (error: any) {
      toast.error('Failed to send reset email', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const confirmReset = async (data: {
    token: string
    new_password: string
    new_password_confirm: string
  }): Promise<void> => {
    try {
      setLoading(true)
      await apiClient.confirmPasswordReset(data)
      toast.success('Password reset successful', {
        description: 'You can now log in with your new password.',
      })
    } catch (error: any) {
      toast.error('Failed to reset password', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    requestReset,
    confirmReset,
  }
}

// Custom hook for email verification
export function useEmailVerification() {
  const [loading, setLoading] = useState(false)
  const { refreshProfile } = useAuth()

  const verifyEmail = async (token: string): Promise<void> => {
    try {
      setLoading(true)
      await apiClient.verifyEmail(token)
      await refreshProfile()
      toast.success('Email verified successfully')
    } catch (error: any) {
      toast.error('Failed to verify email', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    verifyEmail,
  }
}

// Custom hook for session management
export function useSessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSessions = async (): Promise<void> => {
    try {
      setLoading(true)
      const userSessions = await apiClient.getSessions()
      setSessions(userSessions)
    } catch (error: any) {
      toast.error('Failed to fetch sessions', {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const revokeSession = async (sessionId: string): Promise<void> => {
    try {
      await apiClient.revokeSession(sessionId)
      setSessions(sessions.filter(session => session.id !== sessionId))
      toast.success('Session revoked successfully')
    } catch (error: any) {
      toast.error('Failed to revoke session', {
        description: error.message,
      })
      throw error
    }
  }

  return {
    sessions,
    loading,
    fetchSessions,
    revokeSession,
  }
}

// Custom hook for admin functions
export function useAdmin() {
  const { hasPermission } = useAuth()
  const [loading, setLoading] = useState(false)

  const canAccessAdmin = hasPermission('admin:read')

  const getUsers = async (page = 1, size = 20) => {
    try {
      setLoading(true)
      return await apiClient.getUsers(page, size)
    } catch (error: any) {
      toast.error('Failed to fetch users', {
        description: error.message,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getUser = async (userId: string) => {
    try {
      return await apiClient.getUser(userId)
    } catch (error: any) {
      toast.error('Failed to fetch user', {
        description: error.message,
      })
      throw error
    }
  }

  const getRoles = async () => {
    try {
      return await apiClient.getRoles()
    } catch (error: any) {
      toast.error('Failed to fetch roles', {
        description: error.message,
      })
      throw error
    }
  }

  const assignRole = async (userId: string, roleId: string) => {
    try {
      await apiClient.assignRole(userId, roleId)
      toast.success('Role assigned successfully')
    } catch (error: any) {
      toast.error('Failed to assign role', {
        description: error.message,
      })
      throw error
    }
  }

  const removeRole = async (userId: string, roleId: string) => {
    try {
      await apiClient.removeRole(userId, roleId)
      toast.success('Role removed successfully')
    } catch (error: any) {
      toast.error('Failed to remove role', {
        description: error.message,
      })
      throw error
    }
  }

  const getUserStats = async () => {
    try {
      return await apiClient.getUserStats()
    } catch (error: any) {
      toast.error('Failed to fetch user stats', {
        description: error.message,
      })
      throw error
    }
  }

  const getSecurityStats = async () => {
    try {
      return await apiClient.getSecurityStats()
    } catch (error: any) {
      toast.error('Failed to fetch security stats', {
        description: error.message,
      })
      throw error
    }
  }

  return {
    loading,
    canAccessAdmin,
    getUsers,
    getUser,
    getRoles,
    assignRole,
    removeRole,
    getUserStats,
    getSecurityStats,
  }
}

export default useProfile
