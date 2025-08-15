import React from 'react';
import { useRateLimit } from '@/contexts/rate-limit-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertTriangle } from 'lucide-react';

interface RateLimitWrapperProps {
  children: React.ReactElement;
  showTooltip?: boolean;
  disableOnWarning?: boolean;
}

export function RateLimitWrapper({ 
  children, 
  showTooltip = true, 
  disableOnWarning = false 
}: RateLimitWrapperProps) {
  const { isLimited, isAtWarning, timeUntilReset } = useRateLimit();
  
  const shouldDisable = isLimited || (disableOnWarning && isAtWarning);
  
  if (!shouldDisable) {
    return children;
  }

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const tooltipContent = isLimited 
    ? `Rate limit reached. Please wait ${formatTime(timeUntilReset)} or upgrade your plan.`
    : 'You are approaching your rate limit. Consider upgrading your plan.';

  // Wrapper div with disabled styling and event blocking
  const DisabledWrapper = ({ children: child }: { children: React.ReactElement }) => (
    <div 
      className="inline-flex opacity-50 cursor-not-allowed pointer-events-none"
      title={showTooltip ? undefined : tooltipContent}
      aria-disabled="true"
    >
      {child}
    </div>
  );

  if (!showTooltip) {
    return <DisabledWrapper>{children}</DisabledWrapper>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DisabledWrapper>{children}</DisabledWrapper>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span>{tooltipContent}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Hook for manually checking if actions should be disabled
export function useRateLimitCheck() {
  const { isLimited, isAtWarning } = useRateLimit();
  
  return {
    isBlocked: isLimited,
    isWarning: isAtWarning,
    canPerformAction: !isLimited,
    canPerformWithWarning: !isLimited && !isAtWarning
  };
}
