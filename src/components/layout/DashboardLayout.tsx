'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: React.ReactNode
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ label: string; href?: string }>
}

export default function DashboardLayout({
  children,
  className,
  title,
  subtitle,
  action,
  showBreadcrumb = false,
  breadcrumbItems = []
}: DashboardLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-neutral-50",
      "nimbus-theme-container",
      className
    )}>
      {/* Header Section */}
      {(title || subtitle || action || showBreadcrumb) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-b border-neutral-200 px-6 py-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            {showBreadcrumb && breadcrumbItems.length > 0 && (
              <nav className="mb-4">
                <ol className="flex items-center space-x-2 text-sm text-neutral-600">
                  {breadcrumbItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="w-4 h-4 mx-2 text-neutral-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {item.href ? (
                        <a
                          href={item.href}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className={index === breadcrumbItems.length - 1 ? 'text-neutral-900 font-medium' : ''}>
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Header Content */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                {title && (
                  <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-lg text-neutral-600 max-w-2xl">
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
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-1 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  )
}

// Additional layout components for common patterns
export function DashboardGrid({ 
  children, 
  columns = 1, 
  className 
}: { 
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string 
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      'grid gap-6',
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  )
}

export function DashboardSection({ 
  title, 
  children, 
  className,
  titleClassName,
  contentClassName 
}: {
  title?: string
  children: React.ReactNode
  className?: string
  titleClassName?: string
  contentClassName?: string
}) {
  return (
    <section className={cn('space-y-6', className)}>
      {title && (
        <h2 className={cn(
          'text-xl font-semibold text-neutral-900',
          titleClassName
        )}>
          {title}
        </h2>
      )}
      <div className={cn(contentClassName)}>
        {children}
      </div>
    </section>
  )
}
