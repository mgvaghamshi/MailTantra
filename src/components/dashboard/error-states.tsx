"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi,
  Shield,
  Clock,
  XCircle,
  Info,
  CheckCircle
} from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  actionLabel?: string;
  onAction?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;
  fullWidth?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  type = 'error',
  actionLabel,
  onAction,
  showRetry = true,
  onRetry,
  fullWidth = false
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case 'info':
        return <Info className="h-8 w-8 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getAlertVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  const Component = fullWidth ? 'div' : Card;
  
  return (
    <Component className={fullWidth ? '' : ''}>
      <CardContent className={fullWidth ? 'py-8' : 'flex items-center justify-center py-8'}>
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4">
            {getIcon()}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-6">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showRetry && onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {actionLabel && onAction && (
              <Button onClick={onAction} size="sm">
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Component>
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      type="error"
      showRetry={true}
      onRetry={onRetry}
    />
  );
}

export function AuthErrorState({ onLogin }: { onLogin?: () => void }) {
  return (
    <ErrorState
      title="Authentication Required"
      message="You need to be signed in to view this content. Please log in to continue."
      type="warning"
      actionLabel="Sign In"
      onAction={onLogin}
      showRetry={false}
    />
  );
}

export function RateLimitErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Rate Limit Exceeded"
      message="You've made too many requests. Please wait a moment before trying again."
      type="warning"
      showRetry={true}
      onRetry={onRetry}
    />
  );
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon: Icon = Info
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function DataErrorBoundary({
  error,
  onRetry,
  fallbackMessage = "Failed to load data"
}: {
  error: string | null;
  onRetry?: () => void;
  fallbackMessage?: string;
}) {
  if (!error) return null;

  // Check for specific error types
  if (error.includes('Network') || error.includes('fetch')) {
    return <NetworkErrorState onRetry={onRetry} />;
  }
  
  if (error.includes('Authentication') || error.includes('401') || error.includes('403')) {
    return <AuthErrorState />;
  }
  
  if (error.includes('Rate limit') || error.includes('429')) {
    return <RateLimitErrorState onRetry={onRetry} />;
  }

  return (
    <ErrorState
      title="Error Loading Data"
      message={error || fallbackMessage}
      onRetry={onRetry}
    />
  );
}

export function InlineErrorAlert({
  title,
  message,
  type = 'error',
  onDismiss
}: {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
}) {
  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {title && <strong className="block mb-1">{title}</strong>}
        {message}
      </AlertDescription>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onDismiss}
        >
          ×
        </Button>
      )}
    </Alert>
  );
}
