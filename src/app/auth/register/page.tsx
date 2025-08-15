'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { RegisterForm } from '@/components/auth/register-form'
import { useAuth } from '@/contexts/auth-context'

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null // Will redirect
  }

  return <RegisterForm />
}
