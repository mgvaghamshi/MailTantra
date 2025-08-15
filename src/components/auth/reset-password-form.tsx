'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Loader2, Check } from 'lucide-react'

import { usePasswordReset } from '@/hooks/use-auth'
import { passwordResetConfirmSchema, PasswordResetConfirmFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Password strength checker
const getPasswordStrength = (password: string): number => {
  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25
  if (/[^A-Za-z0-9]/.test(password)) strength += 25
  return strength
}

const getPasswordStrengthText = (strength: number): string => {
  if (strength === 0) return 'Very Weak'
  if (strength <= 25) return 'Weak'
  if (strength <= 50) return 'Fair'
  if (strength <= 75) return 'Good'
  return 'Strong'
}

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { confirmReset, loading } = usePasswordReset()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: {
      token,
    },
  })

  const password = watch('new_password', '')
  const passwordStrength = getPasswordStrength(password)

  const onSubmit = async (data: PasswordResetConfirmFormData) => {
    try {
      await confirmReset(data)
      router.push('/auth/login?message=password-reset-success')
    } catch (error) {
      // Error is handled by the hook
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-lg font-semibold text-red-600">Invalid Reset Link</h2>
            <p className="text-gray-600">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              onClick={() => router.push('/auth/forgot-password')}
              variant="outline"
            >
              Request New Reset Link
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />

          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                {...register('new_password')}
                id="new_password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                className="pl-10 pr-10"
                disabled={isSubmitting || loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Password strength</span>
                  <span className={passwordStrength === 100 ? 'text-green-600' : 'text-gray-500'}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className="h-2"
                />
              </div>
            )}
            {errors.new_password && (
              <p className="text-sm text-red-600">{errors.new_password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password_confirm">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                {...register('new_password_confirm')}
                id="new_password_confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                className="pl-10 pr-10"
                disabled={isSubmitting || loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.new_password_confirm && (
              <p className="text-sm text-red-600">{errors.new_password_confirm.message}</p>
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
                Resetting password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
