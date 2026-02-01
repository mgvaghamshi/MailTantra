'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { apiClient } from '@/lib/api-client'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'

interface JWTPayload {
  sub: string
  session_id: string
  jti: string
  type: 'access' | 'refresh'
  exp: number
  iat: number
}

const ACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes of inactivity before logout
const TOKEN_REFRESH_THRESHOLD = 2 * 60 * 1000 // Refresh token when 2 minutes remain
const ACTIVITY_CHECK_INTERVAL = 30 * 1000 // Check activity every 30 seconds

export function useSessionManagement() {
  const { isAuthenticated, logout } = useAuth()
  const lastActivityRef = useRef<number>(Date.now())
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasShownWarningRef = useRef<boolean>(false)

  // Get remaining time on token
  const getTokenTimeRemaining = useCallback((): number => {
    const token = apiClient.getAccessToken()
    if (!token) return 0

    try {
      const decoded = jwtDecode<JWTPayload>(token)
      const currentTime = Date.now() / 1000
      const remainingSeconds = decoded.exp - currentTime
      return Math.max(0, remainingSeconds * 1000)
    } catch {
      return 0
    }
  }, [])

  // Refresh token if it's expiring soon
  const refreshTokenIfNeeded = useCallback(async () => {
    const timeRemaining = getTokenTimeRemaining()

    // If token has less than threshold remaining, refresh it
    if (timeRemaining < TOKEN_REFRESH_THRESHOLD && timeRemaining > 0) {
      try {
        await apiClient.refreshTokens()
        console.log('✓ Token refreshed automatically due to expiration threshold')
        hasShownWarningRef.current = false // Reset warning flag
      } catch (error) {
        console.error('Failed to auto-refresh token:', error)
        // Token refresh failed, token is expired
        if (!hasShownWarningRef.current) {
          hasShownWarningRef.current = true
          toast.error('Session expired', {
            description: 'Your session has expired. Please log in again.',
          })
          await logout()
        }
      }
    }
  }, [getTokenTimeRemaining, logout])

  // Handle user activity
  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now()

    // Reset inactivity timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }

    inactivityTimeoutRef.current = setTimeout(async () => {
      if (!hasShownWarningRef.current) {
        hasShownWarningRef.current = true
        toast.info('Session timeout', {
          description: 'You have been inactive for 15 minutes and will be logged out.',
        })
        await logout()
      }
    }, ACTIVITY_TIMEOUT)

    // Also refresh token on activity if needed
    refreshTokenIfNeeded()
  }, [refreshTokenIfNeeded, logout])

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, handleActivity])

  // Set up periodic token refresh check
  useEffect(() => {
    if (!isAuthenticated) return

    // Initial check
    refreshTokenIfNeeded()

    // Set up interval to check token expiration
    refreshIntervalRef.current = setInterval(refreshTokenIfNeeded, ACTIVITY_CHECK_INTERVAL)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [isAuthenticated, refreshTokenIfNeeded])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])
}
