'use client';

import React from 'react';
import { useRateLimit } from '@/contexts/rate-limit-context';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowUpCircle, RefreshCw } from 'lucide-react';

interface RateLimitedComponentProps {
  children: React.ReactNode;
  componentType?: 'api-tool' | 'feature' | 'form' | 'button';
  disableWhenLimited?: boolean;
  disableWhenWarning?: boolean;
  showOverlay?: boolean;
  className?: string;
}

export function RateLimitedComponent({
  children,
  componentType = 'feature',
  disableWhenLimited = true,
  disableWhenWarning = false,
  showOverlay = true,
  className = ''
}: RateLimitedComponentProps) {
  const { isLimited, isAtWarning } = useRateLimit();

  const shouldDisable = (disableWhenLimited && isLimited) || (disableWhenWarning && isAtWarning);
  const shouldShowOverlay = shouldDisable && showOverlay;

  const getOverlayMessage = () => {
    if (isLimited) {
      return 'This feature is temporarily unavailable due to API rate limits.';
    }
    if (isAtWarning) {
      return 'This feature may be limited soon due to high API usage.';
    }
    return 'Feature temporarily limited.';
  };

  const handleUpgrade = () => {
    // TODO: Navigate to billing/upgrade page
    alert('Upgrade functionality would redirect to billing page');
  };

  if (!isLimited && !isAtWarning) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Original content */}
      <div 
        className={`${shouldDisable ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}
      >
        {children}
      </div>

      {/* Overlay when disabled */}
      {shouldShowOverlay && (
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg border border-gray-200">
          <div className="text-center p-4 max-w-sm">
            <AlertTriangle className={`h-8 w-8 mx-auto mb-3 ${isLimited ? 'text-red-500' : 'text-orange-500'}`} />
            <h3 className={`font-semibold mb-2 ${isLimited ? 'text-red-700' : 'text-orange-700'}`}>
              {isLimited ? 'Feature Disabled' : 'Feature Limited'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {getOverlayMessage()}
            </p>
            <div className="space-y-2">
              <Button 
                size="sm"
                onClick={handleUpgrade}
                className="w-full"
              >
                <ArrowUpCircle className="h-3 w-3 mr-1" />
                Upgrade Plan
              </Button>
              {isLimited && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh Page
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
