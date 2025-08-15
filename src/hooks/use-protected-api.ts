'use client'

import { useAuth } from '@/contexts/auth-context'
import { useCallback } from 'react'

/**
 * Custom hook that provides protected API call functionality.
 * Prevents API calls when user is not authenticated.
 */
export function useProtectedApi() {
  const { isAuthenticated, loading } = useAuth()

  const protectedCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options: {
      requireAuth?: boolean
      fallbackValue?: T | null
      onUnauthenticated?: () => void
    } = {}
  ): Promise<T | null> => {
    const { 
      requireAuth = true, 
      fallbackValue = null,
      onUnauthenticated 
    } = options

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      if (onUnauthenticated) {
        onUnauthenticated()
      }
      return fallbackValue
    }

    // If still loading, wait or return fallback
    if (loading) {
      return fallbackValue
    }

    try {
      return await apiCall()
    } catch (error) {
      console.error('Protected API call failed:', error)
      throw error
    }
  }, [isAuthenticated, loading])

  const conditionalCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    fallbackValue: T | null = null
  ): Promise<T | null> => {
    if (!isAuthenticated) {
      return fallbackValue
    }
    
    try {
      return await apiCall()
    } catch (error) {
      console.error('Conditional API call failed:', error)
      return fallbackValue
    }
  }, [isAuthenticated])

  return {
    protectedCall,
    conditionalCall,
    isAuthenticated,
    loading
  }
}

/**
 * Utility function to check if an API call should be made
 */
export function shouldMakeApiCall(isAuthenticated: boolean, requireAuth: boolean = true): boolean {
  return !requireAuth || isAuthenticated
}
