'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  animate?: boolean
}

export default function ThemedButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  animate = true,
  disabled,
  onDrag,
  onDragStart,
  onDragEnd,
  onAnimationStart,
  onAnimationEnd,
  ...props
}: ThemedButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'

  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-nimbus hover:shadow-nimbus-md active:bg-primary-700',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 shadow-nimbus-sm hover:shadow-nimbus',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600',
    ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
    destructive: 'bg-error-500 text-white hover:bg-error-600 shadow-nimbus hover:shadow-nimbus-md active:bg-error-700',
    success: 'bg-success-500 text-white hover:bg-success-600 shadow-nimbus hover:shadow-nimbus-md active:bg-success-700',
    warning: 'bg-warning-500 text-white hover:bg-warning-600 shadow-nimbus hover:shadow-nimbus-md active:bg-warning-700'
  }

  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3'
  }

  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  const fullWidthStyles = fullWidth ? 'w-full' : ''

  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    fullWidthStyles,
    className
  )

  const buttonContent = (
    <>
      {loading && (
        <svg
          className={cn('animate-spin', sizeStyles[size].includes('text-xs') ? 'w-3 h-3' : sizeStyles[size].includes('text-sm') ? 'w-4 h-4' : 'w-5 h-5')}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </>
  )

  if (animate) {
    return (
      <motion.button
        className={buttonClasses}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onAnimationStart={onAnimationStart}
      onAnimationEnd={onAnimationEnd}
      {...props}
    >
      {buttonContent}
    </button>
  )
}

// Icon Button Component
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: {
  icon: React.ReactNode
  variant?: ThemedButtonProps['variant']
  size?: ThemedButtonProps['size']
  className?: string
} & Omit<ThemedButtonProps, 'children' | 'leftIcon' | 'rightIcon'>) {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  const buttonSizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  }

  return (
    <ThemedButton
      variant={variant}
      className={cn('rounded-lg', buttonSizes[size], className)}
      {...props}
    >
      <span className={iconSizes[size]}>
        {icon}
      </span>
    </ThemedButton>
  )
}

// Button Group Component
export function ButtonGroup({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex rounded-lg border border-neutral-200 overflow-hidden', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && typeof child.props === 'object' && child.props !== null) {
          return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
            className: cn(
              (child.props as { className?: string }).className,
              'rounded-none border-0',
              index > 0 && 'border-l border-neutral-200'
            )
          })
        }
        return child
      })}
    </div>
  )
}
