'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/contexts/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasPermission, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null // Will redirect
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    )
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">
              You don't have the required role to access this page.
            </p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
