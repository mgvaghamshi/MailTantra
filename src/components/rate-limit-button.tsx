/**
 * Higher-order component to disable API-related buttons when rate limited
 */
"use client";

import React from 'react';
import { useRateLimit } from '@/contexts/rate-limit-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RateLimitButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  showTooltip?: boolean;
}

export function RateLimitButton({ 
  children, 
  disabled, 
  className, 
  showTooltip = true,
  ...props 
}: RateLimitButtonProps) {
  const { isLimited } = useRateLimit();

  const isDisabled = disabled || isLimited;

  return (
    <div className="relative group">
      <Button
        {...props}
        disabled={isDisabled}
        className={cn(
          className,
          isLimited && "opacity-50 cursor-not-allowed"
        )}
      >
        {children}
      </Button>
      
      {/* Tooltip when rate limited */}
      {isLimited && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Rate limit exceeded. Please wait for reset.
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to check if API calls should be disabled
 */
export function useApiCallsDisabled() {
  const { isLimited } = useRateLimit();
  return isLimited;
}
