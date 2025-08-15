'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a password reset link to your email address. 
            Click the link in the email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Didn't receive email? Try again
            </Button>
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <ForgotPasswordForm onSuccess={() => setEmailSent(true)} />
}
