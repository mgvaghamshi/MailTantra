'use client'

import { useAuth } from '@/contexts/auth-context'
import { useEffect, ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  allowUnauthenticated?: boolean
}

/**
 * AuthGuard component that prevents rendering of children when user is not authenticated.
 * This helps prevent unnecessary API calls from components that require authentication.
 */
export function AuthGuard({ 
  children, 
  fallback = null, 
  allowUnauthenticated = false 
}: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
    </div>
  }

  // If authentication is required and user is not authenticated, show fallback
  if (!allowUnauthenticated && !isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface ConditionalRenderProps {
  condition: boolean
  children: ReactNode
  fallback?: ReactNode
}

/**
 * ConditionalRender component for conditional rendering based on authentication state
 */
export function ConditionalRender({ condition, children, fallback = null }: ConditionalRenderProps) {
  return condition ? <>{children}</> : <>{fallback}</>
}

/**
 * Higher-order component to wrap components that require authentication
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: { fallback?: ReactNode; allowUnauthenticated?: boolean } = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
