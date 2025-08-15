'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ThemedCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'bordered' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

export default function ThemedCard({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = true,
  clickable = false,
  onClick
}: ThemedCardProps) {
  const baseStyles = 'bg-white rounded-nimbus transition-all duration-200'
  
  const variantStyles = {
    default: 'border border-neutral-200 shadow-nimbus',
    elevated: 'shadow-nimbus-md border border-neutral-100',
    bordered: 'border-2 border-neutral-200 shadow-nimbus-sm',
    glass: 'backdrop-blur-nimbus bg-white/80 border border-neutral-200/50 shadow-nimbus-lg'
  }

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const hoverStyles = hover ? 'hover:shadow-nimbus-lg hover:border-neutral-300' : ''
  const clickableStyles = clickable ? 'cursor-pointer hover:scale-[1.02]' : ''

  const cardClasses = cn(
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    hoverStyles,
    clickableStyles,
    className
  )

  const CardComponent = clickable ? motion.div : 'div'

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...(clickable && {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 }
      })}
    >
      {children}
    </CardComponent>
  )
}

// Card Header Component
export function CardHeader({
  title,
  subtitle,
  action,
  className
}: {
  title?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div className="space-y-1">
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-neutral-600">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}

// Card Content Component
export function CardContent({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  )
}

// Card Footer Component
export function CardFooter({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-neutral-200', className)}>
      {children}
    </div>
  )
}

// Stat Card Component
export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className
}: {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}) {
  const changeColors = {
    positive: 'text-success-600 bg-success-50',
    negative: 'text-error-600 bg-error-50',
    neutral: 'text-neutral-600 bg-neutral-50'
  }

  return (
    <ThemedCard variant="elevated" className={className}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          {change && (
            <span className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              changeColors[changeType]
            )}>
              {change}
            </span>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 bg-primary-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </ThemedCard>
  )
}
