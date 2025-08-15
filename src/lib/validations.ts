import { z } from 'zod'

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

// Registration validation schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    password_confirm: z.string().min(1, 'Please confirm your password'),
    first_name: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be less than 50 characters'),
    last_name: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be less than 50 characters'),
    terms: z.boolean().optional(), // Optional since we handle it manually
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ['password_confirm'],
  })

// Profile update validation schema
export const profileUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  timezone: z.string().optional(),
  locale: z.string().optional(),
})

// Change password validation schema
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    new_password_confirm: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords don't match",
    path: ['new_password_confirm'],
  })

// Password reset request validation schema
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

// Password reset confirm validation schema
export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    new_password_confirm: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords don't match",
    path: ['new_password_confirm'],
  })

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>
