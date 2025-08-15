'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'

import { usePasswordReset } from '@/hooks/use-auth'
import { passwordResetRequestSchema, PasswordResetRequestFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { requestReset, loading } = usePasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
  })

  const onSubmit = async (data: PasswordResetRequestFormData) => {
    try {
      await requestReset(data.email)
      onSuccess?.()
    } catch (error) {
      // Error is handled by the hook
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                disabled={isSubmitting || loading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
