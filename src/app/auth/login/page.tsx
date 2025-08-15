'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { LoginForm } from '@/components/auth/login-form'
import { useAuth } from '@/contexts/auth-context'

function LoginPageContent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
      return
    }

    // Show success messages from redirects
    if (message === 'registration-success') {
      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account, then sign in.',
      })
    } else if (message === 'password-reset-success') {
      toast.success('Password reset successful!', {
        description: 'You can now sign in with your new password.',
      })
    } else if (message === 'email-verified') {
      toast.success('Email verified successfully!', {
        description: 'You can now sign in to your account.',
      })
    }
  }, [isAuthenticated, router, message])

  if (isAuthenticated) {
    return null // Will redirect
  }

  return <LoginForm />
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
