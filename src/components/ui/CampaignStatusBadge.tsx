'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'completed' | 'failed'

interface CampaignStatusBadgeProps {
  status: CampaignStatus
  className?: string
  animate?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CampaignStatusBadge({
  status,
  className,
  animate = true,
  showIcon = true,
  size = 'md'
}: CampaignStatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: 'Draft',
      colors: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    scheduled: {
      label: 'Scheduled',
      colors: 'bg-primary-50 text-primary-700 border-primary-200',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    sending: {
      label: 'Sending',
      colors: 'bg-warning-50 text-warning-700 border-warning-200',
      icon: (
        <svg className="w-full h-full animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    sent: {
      label: 'Sent',
      colors: 'bg-success-50 text-success-700 border-success-200',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    },
    paused: {
      label: 'Paused',
      colors: 'bg-neutral-100 text-neutral-600 border-neutral-300',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    completed: {
      label: 'Completed',
      colors: 'bg-success-50 text-success-700 border-success-200',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    failed: {
      label: 'Failed',
      colors: 'bg-error-50 text-error-700 border-error-200',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-2.5 py-1.5 text-sm gap-1.5',
    lg: 'px-3 py-2 text-base gap-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const config = statusConfig[status]
  const badgeClasses = cn(
    'inline-flex items-center rounded-full border font-medium',
    config.colors,
    sizeStyles[size],
    className
  )

  const BadgeComponent = animate ? motion.span : 'span'

  return (
    <BadgeComponent
      className={badgeClasses}
      {...(animate && {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.2 }
      })}
    >
      {showIcon && (
        <span className={iconSizes[size]}>
          {config.icon}
        </span>
      )}
      {config.label}
    </BadgeComponent>
  )
}

// Generic Badge Component
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  animate = false
}: {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animate?: boolean
}) {
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    secondary: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    error: 'bg-error-50 text-error-700 border-error-200'
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }

  const badgeClasses = cn(
    'inline-flex items-center rounded-full border font-medium',
    variantStyles[variant],
    sizeStyles[size],
    className
  )

  if (animate) {
    return (
      <motion.span
        className={badgeClasses}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    )
  }

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  )
}

// Count Badge Component
export function CountBadge({
  count,
  max = 99,
  className,
  variant = 'primary'
}: {
  count: number
  max?: number
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}) {
  const displayCount = count > max ? `${max}+` : count.toString()
  
  const variantStyles = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-neutral-500 text-white',
    success: 'bg-success-500 text-white',
    warning: 'bg-warning-500 text-white',
    error: 'bg-error-500 text-white'
  }

  return (
    <span className={cn(
      'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded-full',
      variantStyles[variant],
      className
    )}>
      {displayCount}
    </span>
  )
}
